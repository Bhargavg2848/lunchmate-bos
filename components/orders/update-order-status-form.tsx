"use client";

import { useState, useTransition } from "react";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/types/order";
import { updateOrderStatus } from "@/app/dashboard/orders/actions";

export function UpdateOrderStatusForm({ order }: { order: Order }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex items-center gap-2"
      action={(formData) => {
        setError(null);
        setSuccess(null);
        formData.set("id", order.id);
        formData.set("status", status);

        startTransition(async () => {
          const result = await updateOrderStatus(formData);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setSuccess("Status updated.");
        });
      }}
    >
      <input type="hidden" name="id" value={order.id} />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as OrderStatus)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white disabled:opacity-70"
      >
        {isPending ? "Saving..." : "Update"}
      </button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      {success ? <p className="text-xs text-green-700">{success}</p> : null}
    </form>
  );
}
