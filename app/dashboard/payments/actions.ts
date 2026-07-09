"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validatePaymentCreateInput, validatePaymentStatusInput } from "@/lib/validation/payment";

export async function createPayment(formData: FormData) {
  const validation = validatePaymentCreateInput({
    order_id: String(formData.get("order_id") || ""),
    amount: String(formData.get("amount") || ""),
    method: String(formData.get("method") || ""),
    status: String(formData.get("status") || "pending"),
    transaction_ref: String(formData.get("transaction_ref") || ""),
    paid_at: String(formData.get("paid_at") || ""),
    notes: String(formData.get("notes") || "")
  });

  if (!validation.valid) {
    return { ok: false, error: validation.errors.join(" ") };
  }

  const supabase = await createSupabaseServerClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id")
    .eq("id", validation.normalized.order_id)
    .single();

  if (orderError || !order) {
    return { ok: false, error: "Invalid order id." };
  }

  const { error } = await supabase.from("payments").insert(validation.normalized);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/payments");
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");

  return { ok: true };
}

export async function updatePaymentStatus(formData: FormData) {
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");

  if (!id) {
    return { ok: false, error: "Missing payment id." };
  }

  const statusValidation = validatePaymentStatusInput(status);
  if (!statusValidation.valid) {
    return { ok: false, error: statusValidation.error };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("payments")
    .update({ status: statusValidation.normalized })
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/payments");
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");

  return { ok: true };
}
