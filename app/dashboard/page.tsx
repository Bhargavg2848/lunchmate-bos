import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardHomePage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const [{ count: customerCount }, { count: orderCount }, { count: paymentCount }, paymentsSumResult] = await Promise.all([
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("payments").select("id", { count: "exact", head: true }),
    supabase.from("payments").select("amount, status")
  ]);

  const revenue = (paymentsSumResult.data || [])
    .filter((payment: any) => payment.status === "paid" || payment.status === "partial")
    .reduce((sum: number, payment: any) => sum + Number(payment.amount || 0), 0);

  const { data: lowStockRows } = await supabase
    .from("inventory_items")
    .select("id, current_stock, min_stock_level")
    .eq("is_active", true);

  const lowStockCount = (lowStockRows || []).filter((row: any) => Number(row.current_stock || 0) <= Number(row.min_stock_level || 0)).length;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 p-6">
      <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold">Operations Dashboard</h1>
        <p className="mt-2 text-slate-600">Signed in as: {user?.email}</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <article className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Customers</p>
          <p className="mt-2 text-2xl font-bold">{customerCount ?? 0}</p>
        </article>

        <article className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Orders</p>
          <p className="mt-2 text-2xl font-bold">{orderCount ?? 0}</p>
        </article>

        <article className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Payments</p>
          <p className="mt-2 text-2xl font-bold">{paymentCount ?? 0}</p>
        </article>

        <article className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Revenue</p>
          <p className="mt-2 text-2xl font-bold">${revenue.toFixed(2)}</p>
        </article>

        <article className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Low Stock Items</p>
          <p className="mt-2 text-2xl font-bold">{lowStockCount}</p>
        </article>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold">Modules</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/dashboard/customers" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white">
            Open Customers
          </Link>
          <Link href="/dashboard/catalog" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white">
            Open Catalog
          </Link>
          <Link href="/dashboard/orders" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white">
            Open Orders
          </Link>
          <Link href="/dashboard/payments" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white">
            Open Payments
          </Link>
          <Link href="/dashboard/inventory" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white">
            Open Inventory
          </Link>
        </div>
      </section>
    </main>
  );
}
