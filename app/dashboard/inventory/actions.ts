"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateAddStockInput, validateAdjustStockInput } from "@/lib/validation/inventory";

export async function addStock(formData: FormData) {
  const validation = validateAddStockInput({
    inventory_item_id: String(formData.get("inventory_item_id") || ""),
    quantity: String(formData.get("quantity") || ""),
    reason: String(formData.get("reason") || ""),
    reference_type: String(formData.get("reference_type") || "manual"),
    reference_id: String(formData.get("reference_id") || "")
  });

  if (!validation.valid) {
    return { ok: false, error: validation.errors.join(" ") };
  }

  const supabase = await createSupabaseServerClient();

  const { data: item, error: itemError } = await supabase
    .from("inventory_items")
    .select("id, current_stock")
    .eq("id", validation.normalized.inventory_item_id)
    .single();

  if (itemError || !item) {
    return { ok: false, error: "Invalid inventory item id." };
  }

  const nextStock = Number((Number(item.current_stock) + validation.normalized.quantity).toFixed(3));

  const { error: updateError } = await supabase
    .from("inventory_items")
    .update({ current_stock: nextStock })
    .eq("id", item.id);

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  const { error: txnError } = await supabase.from("inventory_transactions").insert({
    inventory_item_id: item.id,
    type: "in",
    quantity: validation.normalized.quantity,
    reason: validation.normalized.reason,
    reference_type: validation.normalized.reference_type,
    reference_id: validation.normalized.reference_id || null
  });

  if (txnError) {
    return { ok: false, error: txnError.message };
  }

  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/catalog");

  return { ok: true };
}

export async function adjustStock(formData: FormData) {
  const validation = validateAdjustStockInput({
    inventory_item_id: String(formData.get("inventory_item_id") || ""),
    delta: String(formData.get("delta") || ""),
    reason: String(formData.get("reason") || ""),
    reference_type: String(formData.get("reference_type") || "manual_adjustment"),
    reference_id: String(formData.get("reference_id") || "")
  });

  if (!validation.valid) {
    return { ok: false, error: validation.errors.join(" ") };
  }

  const supabase = await createSupabaseServerClient();

  const { data: item, error: itemError } = await supabase
    .from("inventory_items")
    .select("id, current_stock")
    .eq("id", validation.normalized.inventory_item_id)
    .single();

  if (itemError || !item) {
    return { ok: false, error: "Invalid inventory item id." };
  }

  const nextStock = Number((Number(item.current_stock) + validation.normalized.delta).toFixed(3));

  if (nextStock < 0) {
    return { ok: false, error: "Adjustment would result in negative stock." };
  }

  const { error: updateError } = await supabase
    .from("inventory_items")
    .update({ current_stock: nextStock })
    .eq("id", item.id);

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  const txnType = validation.normalized.delta > 0 ? "in" : "out";

  const { error: txnError } = await supabase.from("inventory_transactions").insert({
    inventory_item_id: item.id,
    type: "adjustment",
    quantity: Math.abs(validation.normalized.delta),
    reason: validation.normalized.reason,
    reference_type: validation.normalized.reference_type,
    reference_id: validation.normalized.reference_id || null
  });

  if (txnError) {
    return { ok: false, error: txnError.message };
  }

  // TODO: if direct order-item-to-inventory mapping is finalized,
  // hook order-completed flow to emit automatic OUT transactions.
  void txnType;

  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/catalog");

  return { ok: true };
}

export async function listInventory() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("inventory_items")
    .select("id, catalog_item_id, sku, current_stock, min_stock_level, unit, is_active, created_at, updated_at, catalog_items(name)")
    .order("created_at", { ascending: false });

  if (error) {
    return { ok: false, error: error.message, data: [] as any[] };
  }

  const mapped = (data || []).map((row: any) => ({
    ...row,
    catalog_item_name: row.catalog_items?.name ?? "Unknown item"
  }));

  return { ok: true, data: mapped };
}
