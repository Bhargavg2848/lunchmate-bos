import type { Payment } from "@/lib/types/payment";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";

export function PaymentsTable({ payments }: { payments: Payment[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-slate-600">Order</th>
            <th className="px-3 py-2 text-left font-medium text-slate-600">Amount</th>
            <th className="px-3 py-2 text-left font-medium text-slate-600">Method</th>
            <th className="px-3 py-2 text-left font-medium text-slate-600">Status</th>
            <th className="px-3 py-2 text-left font-medium text-slate-600">Txn Ref</th>
            <th className="px-3 py-2 text-left font-medium text-slate-600">Paid At</th>
            <th className="px-3 py-2 text-left font-medium text-slate-600">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {payments.length === 0 ? (
            <tr>
              <td className="px-3 py-4 text-slate-500" colSpan={7}>
                No payments found.
              </td>
            </tr>
          ) : (
            payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-3 py-2 font-mono text-xs">#{payment.order_id.slice(0, 8)}</td>
                <td className="px-3 py-2">${payment.amount.toFixed(2)}</td>
                <td className="px-3 py-2 capitalize">{payment.method.replace("_", " ")}</td>
                <td className="px-3 py-2">
                  <PaymentStatusBadge status={payment.status} />
                </td>
                <td className="px-3 py-2 text-slate-600">{payment.transaction_ref || "—"}</td>
                <td className="px-3 py-2 text-slate-600">{payment.paid_at ? new Date(payment.paid_at).toLocaleString() : "—"}</td>
                <td className="px-3 py-2 text-slate-600">{new Date(payment.created_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
