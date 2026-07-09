import type { InventoryItem } from "@/lib/types/inventory";
import { LowStockBadge } from "@/components/inventory/low-stock-badge";

export function InventoryTable({ items }: { items: InventoryItem[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-slate-600">Item</th>
            <th className="px-3 py-2 text-left font-medium text-slate-600">SKU</th>
            <th className="px-3 py-2 text-left font-medium text-slate-600">Stock</th>
            <th className="px-3 py-2 text-left font-medium text-slate-600">Min Level</th>
            <th className="px-3 py-2 text-left font-medium text-slate-600">Unit</th>
            <th className="px-3 py-2 text-left font-medium text-slate-600">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {items.length === 0 ? (
            <tr>
              <td className="px-3 py-4 text-slate-500" colSpan={6}>
                No inventory items found.
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const low = item.current_stock <= item.min_stock_level;
              return (
                <tr key={item.id}>
                  <td className="px-3 py-2 font-medium">{item.catalog_item_name || "Unknown item"}</td>
                  <td className="px-3 py-2 text-slate-600">{item.sku || "—"}</td>
                  <td className="px-3 py-2">{item.current_stock.toFixed(3)}</td>
                  <td className="px-3 py-2">{item.min_stock_level.toFixed(3)}</td>
                  <td className="px-3 py-2 text-slate-600">{item.unit}</td>
                  <td className="px-3 py-2">
                    <LowStockBadge low={low} />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
