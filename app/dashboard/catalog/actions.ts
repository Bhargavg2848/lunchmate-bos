"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateCategoryInput, validateItemInput } from "@/lib/validation/catalog";

export async function createCategory(formData: FormData) {
  const validation = validateCategoryInput({
    name: String(formData.get("name") || ""),
    description: String(formData.get("description") || "")
  });

  if (!validation.valid) {
    return { ok: false, error: validation.errors.join(" ") };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("catalog_categories").insert(validation.normalized);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/catalog");
  return { ok: true };
}

export async function updateCategory(formData: FormData) {
  const id = String(formData.get("id") || "");

  if (!id) return { ok: false, error: "Missing category id." };

  const validation = validateCategoryInput({
    name: String(formData.get("name") || ""),
    description: String(formData.get("description") || "")
  });

  if (!validation.valid) {
    return { ok: false, error: validation.errors.join(" ") };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("catalog_categories")
    .update(validation.normalized)
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/catalog");
  return { ok: true };
}

export async function toggleCategoryActive(formData: FormData) {
  const id = String(formData.get("id") || "");
  const is_active = String(formData.get("is_active") || "") === "true";

  if (!id) return { ok: false, error: "Missing category id." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("catalog_categories")
    .update({ is_active: !is_active })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/catalog");
  return { ok: true };
}

export async function createItem(formData: FormData) {
  const validation = validateItemInput({
    category_id: String(formData.get("category_id") || ""),
    name: String(formData.get("name") || ""),
    description: String(formData.get("description") || ""),
    price: String(formData.get("price") || "")
  });

  if (!validation.valid) {
    return { ok: false, error: validation.errors.join(" ") };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("catalog_items").insert(validation.normalized);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/catalog");
  return { ok: true };
}

export async function updateItem(formData: FormData) {
  const id = String(formData.get("id") || "");

  if (!id) return { ok: false, error: "Missing item id." };

  const validation = validateItemInput({
    category_id: String(formData.get("category_id") || ""),
    name: String(formData.get("name") || ""),
    description: String(formData.get("description") || ""),
    price: String(formData.get("price") || "")
  });

  if (!validation.valid) {
    return { ok: false, error: validation.errors.join(" ") };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("catalog_items")
    .update(validation.normalized)
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/catalog");
  return { ok: true };
}

export async function toggleItemAvailability(formData: FormData) {
  const id = String(formData.get("id") || "");
  const is_available = String(formData.get("is_available") || "") === "true";

  if (!id) return { ok: false, error: "Missing item id." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("catalog_items")
    .update({ is_available: !is_available })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/catalog");
  return { ok: true };
}
