"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateCustomerInput } from "@/lib/validation/customer";

export async function createCustomer(formData: FormData) {
  const validation = validateCustomerInput({
    full_name: String(formData.get("full_name") || ""),
    phone: String(formData.get("phone") || ""),
    email: String(formData.get("email") || ""),
    notes: String(formData.get("notes") || "")
  });

  if (!validation.valid) {
    return { ok: false, error: validation.errors.join(" ") };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("customers").insert(validation.normalized);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/customers");
  return { ok: true };
}

export async function updateCustomer(formData: FormData) {
  const id = String(formData.get("id") || "");

  const validation = validateCustomerInput({
    full_name: String(formData.get("full_name") || ""),
    phone: String(formData.get("phone") || ""),
    email: String(formData.get("email") || ""),
    notes: String(formData.get("notes") || "")
  });

  if (!id) {
    return { ok: false, error: "Missing customer id." };
  }

  if (!validation.valid) {
    return { ok: false, error: validation.errors.join(" ") };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("customers")
    .update(validation.normalized)
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/customers");
  return { ok: true };
}
