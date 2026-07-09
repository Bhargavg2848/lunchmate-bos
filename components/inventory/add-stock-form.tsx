"use client";

import { useState, useTransition } from "react";
import type { InventoryItem } from "@/lib/types/inventory";
import { addStock } from "@/app/dashboard/inventory/actions";

export function AddStockForm({ items }: { items: InventoryItem[] }) {
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
          const result = await addStock(formData);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setSuccess("Stock added.");
        });
      }}
    >
      <h2 className="text-lg font-semibold">Add Stock</h2>

      <select name="inventory_item_id" className="rounded-lg border border-slate-300 px-3 py-2" required defaultValue="">
        <option value="" disabled>
          Select inventory item
        </option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.catalog_item_name || "Item"} ({item.sku || "no-sku"})
          </option>
        ))}
      </select>

      <input
        name="quantity"
        type="number"
        step="0.001"
        min="0.001"
        required
        placeholder="Quantity"
        className="rounded-lg border border-slate-300 px-3 py-2"
      />

      <input name="reason" placeholder="Reason (optional)" className="rounded-lg border border-slate-300 px-3 py-2" />
      <input
        name="reference_type"
        defaultValue="manual"
        className="rounded-lg border border-slate-300 px-3 py-2"
      />
      <input name="reference_id" placeholder="Reference ID (optional)" className="rounded-lg border border-slate-300 px-3 py-2" />

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 disabled:opacity-70"
      >
        {isPending ? "Saving..." : "Add Stock"}
      </button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-green-700">{success}</p> : null}
    </form>
  );
}
