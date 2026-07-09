import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { InventoryItem } from "@/lib/types/inventory";
import { listInventory } from "@/app/dashboard/inventory/actions";
import { AddStockForm } from "@/components/inventory/add-stock-form";
import { AdjustStockForm } from "@/components/inventory/adjust-stock-form";
import { InventoryTable } from "@/components/inventory/inventory-table";

export default async function InventoryPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const inventoryResult = await listInventory();

  const items = (inventoryResult.data || []) as InventoryItem[];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 p-6">
      <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="mt-2 text-slate-600">Track stock levels, low stock thresholds, and manual adjustments.</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <AddStockForm items={items} />
        <AdjustStockForm items={items} />
      </section>

      <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-3 text-lg font-semibold">Inventory Items</h2>
        {!inventoryResult.ok ? <p className="mb-3 text-sm text-red-600">{inventoryResult.error}</p> : null}
        <InventoryTable items={items} />
      </section>
    </main>
  );
}
