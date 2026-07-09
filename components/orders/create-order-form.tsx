"use client";

import { useMemo, useState, useTransition } from "react";
import type { CatalogItem } from "@/lib/types/catalog";
import type { Customer } from "@/lib/types/customer";
import { createOrder } from "@/app/dashboard/orders/actions";

type SelectedOrderItem = {
  catalog_item_id: string;
  quantity: number;
};

export function CreateOrderForm({
  customers,
  items
}: {
  customers: Customer[];
  items: CatalogItem[];
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [notes, setNotes] = useState("");
  const [tax, setTax] = useState("0");
  const [discount, setDiscount] = useState("0");
  const [selectedItems, setSelectedItems] = useState<SelectedOrderItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const availableItems = useMemo(() => items.filter((item) => item.is_available && item.is_active), [items]);

  function addItemRow() {
    if (availableItems.length === 0) return;
    setSelectedItems((prev) => [...prev, { catalog_item_id: availableItems[0].id, quantity: 1 }]);
  }

  function removeItemRow(index: number) {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItemRow(index: number, next: Partial<SelectedOrderItem>) {
    setSelectedItems((prev) => prev.map((row, i) => (i === index ? { ...row, ...next } : row)));
  }

  const subtotal = selectedItems.reduce((acc, row) => {
    const matched = items.find((item) => item.id === row.catalog_item_id);
    if (!matched) return acc;
    return acc + matched.price * row.quantity;
  }, 0);

  const taxValue = Number(tax || "0");
  const discountValue = Number(discount || "0");
  const grandTotal = subtotal + (Number.isNaN(taxValue) ? 0 : taxValue) - (Number.isNaN(discountValue) ? 0 : discountValue);

  return (
    <form
      className="grid gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
      action={(formData) => {
        setError(null);
        setSuccess(null);

        formData.set("customer_id", selectedCustomerId);
        formData.set("notes", notes);
        formData.set("tax", tax);
        formData.set("discount", discount);
        formData.set("items", JSON.stringify(selectedItems));

        startTransition(async () => {
          const result = await createOrder(formData);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setSuccess("Order created.");
          setSelectedItems([]);
          setNotes("");
          setTax("0");
          setDiscount("0");
        });
      }}
    >
      <div>
        <h2 className="text-lg font-semibold">Create Order</h2>
        <p className="text-sm text-slate-600">Add one or more items with quantity. Customer is optional.</p>
      </div>

      <select
        value={selectedCustomerId}
        onChange={(e) => setSelectedCustomerId(e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2"
      >
        <option value="">Walk-in / No customer</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.full_name} ({customer.phone})
          </option>
        ))}
      </select>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        className="rounded-lg border border-slate-300 px-3 py-2"
        rows={2}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="number"
          min="0"
          step="0.01"
          value={tax}
          onChange={(e) => setTax(e.target.value)}
          placeholder="Tax"
          className="rounded-lg border border-slate-300 px-3 py-2"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          placeholder="Discount"
          className="rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="rounded-lg border border-slate-200 p-3">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-medium">Order Items</h3>
          <button
            type="button"
            onClick={addItemRow}
            className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white"
          >
            Add Item
          </button>
        </div>

        <div className="grid gap-2">
          {selectedItems.length === 0 ? (
            <p className="text-sm text-slate-500">No items selected.</p>
          ) : (
            selectedItems.map((row, index) => {
              const matched = items.find((i) => i.id === row.catalog_item_id);
              return (
                <div key={`${row.catalog_item_id}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_120px_auto]">
                  <select
                    value={row.catalog_item_id}
                    onChange={(e) => updateItemRow(index, { catalog_item_id: e.target.value })}
                    className="rounded-lg border border-slate-300 px-3 py-2"
                  >
                    {availableItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} (${item.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={row.quantity}
                    onChange={(e) => updateItemRow(index, { quantity: Number(e.target.value) })}
                    className="rounded-lg border border-slate-300 px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeItemRow(index)}
                    className="rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-300"
                  >
                    Remove
                  </button>
                  <p className="text-xs text-slate-500 sm:col-span-3">
                    Line total: ${((matched?.price || 0) * row.quantity).toFixed(2)}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Tax: ${(Number.isNaN(taxValue) ? 0 : taxValue).toFixed(2)}</p>
        <p>Discount: ${(Number.isNaN(discountValue) ? 0 : discountValue).toFixed(2)}</p>
        <p className="mt-1 text-base font-semibold">Grand Total: ${grandTotal.toFixed(2)}</p>
      </div>

      <button
        type="submit"
        disabled={isPending || selectedItems.length === 0}
        className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 disabled:opacity-70"
      >
        {isPending ? "Creating..." : "Create Order"}
      </button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-green-700">{success}</p> : null}
    </form>
  );
}
