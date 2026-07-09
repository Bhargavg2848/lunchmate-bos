"use client";

import { useState, useTransition } from "react";
import type { CatalogCategory } from "@/lib/types/catalog";
import { createItem } from "@/app/dashboard/catalog/actions";

export function AddItemForm({ categories }: { categories: CatalogCategory[] }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
      action={(formData) => {
        setError(null);
        setSuccess(null);
        startTransition(async () => {
          const result = await createItem(formData);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setSuccess("Item added.");
        });
      }}
    >
      <h2 className="text-lg font-semibold">Add Item</h2>
      <select name="category_id" className="rounded-lg border border-slate-300 px-3 py-2" required defaultValue="">
        <option value="" disabled>
          Select category
        </option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <input name="name" placeholder="Item name" className="rounded-lg border border-slate-300 px-3 py-2" required />
      <input name="price" type="number" min="0" step="0.01" placeholder="Price" className="rounded-lg border border-slate-300 px-3 py-2" required />
      <textarea name="description" placeholder="Description (optional)" className="rounded-lg border border-slate-300 px-3 py-2" rows={3} />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 disabled:opacity-70"
      >
        {isPending ? "Saving..." : "Save Item"}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-green-700">{success}</p> : null}
    </form>
  );
}
