import type { OrderStatus } from "@/lib/types/order";

const STATUS_CLASSES: Record<OrderStatus, string> = {
  placed: "bg-blue-100 text-blue-700",
  preparing: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700"
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_CLASSES[status]}`}>
      {status}
    </span>
  );
}
