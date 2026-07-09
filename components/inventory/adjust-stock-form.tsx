"use client";

import { useState, useTransition } from "react";
import type { InventoryItem } from "@/lib/types/inventory";
import { adjustStock } from "@/app/dashboard/inventory/actions";

export function AdjustStockForm({ items }: { items: InventoryItem[] }) {
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
          const result = await adjustStock(formData);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setSuccess("Stock adjusted.");
        });
      }}
    >
      <h2 className="text-lg font-semibold">Adjust Stock (+/-)</h2>

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
        name="delta"
        type="number"
        step="0.001"
        required
        placeholder="Adjustment delta (e.g. -1 or 2.5)"
        className="rounded-lg border border-slate-300 px-3 py-2"
      />

      <input name="reason" placeholder="Reason (optional)" className="rounded-lg border border-slate-300 px-3 py-2" />
      <input
        name="reference_type"
        defaultValue="manual_adjustment"
        className="rounded-lg border border-slate-300 px-3 py-2"
      />
      <input name="reference_id" placeholder="Reference ID (optional)" className="rounded-lg border border-slate-300 px-3 py-2" />

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 disabled:opacity-70"
      >
        {isPending ? "Saving..." : "Adjust Stock"}
      </button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-green-700">{success}</p> : null}
    </form>
  );
}
