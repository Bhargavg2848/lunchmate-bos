import type { PaymentStatus } from "@/lib/types/payment";

const STATUS_CLASSES: Record<PaymentStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  failed: "bg-rose-100 text-rose-700",
  refunded: "bg-violet-100 text-violet-700",
  partial: "bg-blue-100 text-blue-700"
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_CLASSES[status]}`}>
      {status}
    </span>
  );
}
