"use client";

import { useState, useTransition } from "react";
import type { CatalogCategory, CatalogItem } from "@/lib/types/catalog";
import { toggleItemAvailability, updateItem } from "@/app/dashboard/catalog/actions";

export function EditItemForm({ item, categories }: { item: CatalogItem; categories: CatalogCategory[] }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="flex gap-2">
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white"
        >
          {open ? "Close Edit" : "Edit"}
        </button>

        <form
          action={(formData) => {
            setError(null);
            setSuccess(null);
            startTransition(async () => {
              const result = await toggleItemAvailability(formData);
              if (!result.ok) {
                setError(result.error);
                return;
              }
              setSuccess(`Item ${item.is_available ? "marked unavailable" : "marked available"}.`);
            });
          }}
        >
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="is_available" value={String(item.is_available)} />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-300"
          >
            {item.is_available ? "Set Unavailable" : "Set Available"}
          </button>
        </form>
      </div>

      {open ? (
        <form
          className="mt-3 grid gap-2"
          action={(formData) => {
            setError(null);
            setSuccess(null);
            startTransition(async () => {
              const result = await updateItem(formData);
              if (!result.ok) {
                setError(result.error);
                return;
              }
              setSuccess("Item updated.");
            });
          }}
        >
          <input type="hidden" name="id" value={item.id} />
          <select
            name="category_id"
            defaultValue={item.category_id}
            className="rounded-lg border border-slate-300 px-3 py-2"
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input name="name" defaultValue={item.name} className="rounded-lg border border-slate-300 px-3 py-2" required />
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={item.price}
            className="rounded-lg border border-slate-300 px-3 py-2"
            required
          />
          <textarea
            name="description"
            defaultValue={item.description ?? ""}
            className="rounded-lg border border-slate-300 px-3 py-2"
            rows={2}
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-70"
          >
            {isPending ? "Updating..." : "Update"}
          </button>
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          {success ? <p className="text-xs text-green-700">{success}</p> : null}
        </form>
      ) : null}
    </div>
  );
}
