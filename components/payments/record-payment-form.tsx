"use client";

import { useState, useTransition } from "react";
import type { Order } from "@/lib/types/order";
import { PAYMENT_METHODS, PAYMENT_STATUSES } from "@/lib/types/payment";
import { createPayment } from "@/app/dashboard/payments/actions";

export function RecordPaymentForm({ orders }: { orders: Order[] }) {
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
          const result = await createPayment(formData);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setSuccess("Payment recorded.");
        });
      }}
    >
      <h2 className="text-lg font-semibold">Record Payment</h2>

      <select name="order_id" className="rounded-lg border border-slate-300 px-3 py-2" required defaultValue="">
        <option value="" disabled>
          Select order
        </option>
        {orders.map((order) => (
          <option key={order.id} value={order.id}>
            #{order.id.slice(0, 8)} • ${order.grand_total.toFixed(2)} • {order.status}
          </option>
        ))}
      </select>

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Amount"
          className="rounded-lg border border-slate-300 px-3 py-2"
          required
        />
        <input
          name="transaction_ref"
          placeholder="Transaction Ref (optional)"
          className="rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <select name="method" className="rounded-lg border border-slate-300 px-3 py-2" defaultValue="cash" required>
          {PAYMENT_METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>

        <select name="status" className="rounded-lg border border-slate-300 px-3 py-2" defaultValue="paid" required>
          {PAYMENT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <input name="paid_at" type="datetime-local" className="rounded-lg border border-slate-300 px-3 py-2" />

      <textarea name="notes" placeholder="Notes (optional)" className="rounded-lg border border-slate-300 px-3 py-2" rows={2} />

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 disabled:opacity-70"
      >
        {isPending ? "Saving..." : "Record Payment"}
      </button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-green-700">{success}</p> : null}
    </form>
  );
}
