"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateCreateOrderInput, validateOrderStatusInput } from "@/lib/validation/order";

export async function createOrder(formData: FormData) {
  const customer_id = String(formData.get("customer_id") || "");
  const notes = String(formData.get("notes") || "");
  const tax = Number(String(formData.get("tax") || "0"));
  const discount = Number(String(formData.get("discount") || "0"));

  const rawItems = String(formData.get("items") || "[]");

  let parsedItems: { catalog_item_id: string; quantity: number }[] = [];

  try {
    parsedItems = JSON.parse(rawItems);
  } catch {
    return { ok: false, error: "Invalid items payload." };
  }

  const validation = validateCreateOrderInput({
    customer_id,
    notes,
    items: parsedItems
  });

  if (!validation.valid) {
    return { ok: false, error: validation.errors.join(" ") };
  }

  if (Number.isNaN(tax) || tax < 0) {
    return { ok: false, error: "Tax must be 0 or greater." };
  }

  if (Number.isNaN(discount) || discount < 0) {
    return { ok: false, error: "Discount must be 0 or greater." };
  }

  const supabase = await createSupabaseServerClient();

  const itemIds = validation.normalized.items.map((i) => i.catalog_item_id);

  const { data: catalogItems, error: catalogError } = await supabase
    .from("catalog_items")
    .select("id, name, price, is_available")
    .in("id", itemIds);

  if (catalogError) {
    return { ok: false, error: catalogError.message };
  }

  const itemMap = new Map((catalogItems || []).map((item: any) => [item.id, item]));

  let subtotal = 0;
  const orderItemsPayload: Array<{
    catalog_item_id: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  }> = [];

  for (const requested of validation.normalized.items) {
    const catalogItem = itemMap.get(requested.catalog_item_id);

    if (!catalogItem) {
      return { ok: false, error: "One or more catalog items were not found." };
    }

    if (!catalogItem.is_available) {
      return { ok: false, error: `Item \"${catalogItem.name}\" is not available.` };
    }

    const unit_price = Number(catalogItem.price);
    const line_total = Number((unit_price * requested.quantity).toFixed(2));

    subtotal += line_total;

    orderItemsPayload.push({
      catalog_item_id: requested.catalog_item_id,
      quantity: requested.quantity,
      unit_price,
      line_total
    });
  }

  subtotal = Number(subtotal.toFixed(2));
  const normalizedTax = Number(tax.toFixed(2));
  const normalizedDiscount = Number(discount.toFixed(2));
  const grand_total = Number((subtotal + normalizedTax - normalizedDiscount).toFixed(2));

  if (grand_total < 0) {
    return { ok: false, error: "Grand total cannot be negative." };
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: validation.normalized.customer_id,
      status: "placed",
      notes: validation.normalized.notes,
      subtotal,
      tax: normalizedTax,
      discount: normalizedDiscount,
      grand_total
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { ok: false, error: orderError?.message || "Failed to create order." };
  }

  const payloadWithOrderId = orderItemsPayload.map((item) => ({
    order_id: order.id,
    ...item
  }));

  const { error: orderItemsError } = await supabase.from("order_items").insert(payloadWithOrderId);

  if (orderItemsError) {
    return { ok: false, error: orderItemsError.message };
  }

  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");

  return { ok: true };
}

export async function updateOrderStatus(formData: FormData) {
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");

  if (!id) {
    return { ok: false, error: "Missing order id." };
  }

  const validation = validateOrderStatusInput(status);

  if (!validation.valid) {
    return { ok: false, error: validation.error };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("orders")
    .update({ status: validation.normalized })
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");

  return { ok: true };
}
