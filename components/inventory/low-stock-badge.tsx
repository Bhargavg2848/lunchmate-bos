export function LowStockBadge({ low }: { low: boolean }) {
  if (!low) {
    return <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">OK</span>;
  }

  return <span className="inline-flex rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">Low Stock</span>;
}
