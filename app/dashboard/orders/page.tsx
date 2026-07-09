import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CatalogItem } from "@/lib/types/catalog";
import type { Customer } from "@/lib/types/customer";
import type { Order } from "@/lib/types/order";
import { CreateOrderForm } from "@/components/orders/create-order-form";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { UpdateOrderStatusForm } from "@/components/orders/update-order-status-form";

export default async function OrdersPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: customersData } = await supabase
    .from("customers")
    .select("id, full_name, phone, email, notes, is_active, created_at, updated_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: catalogItemsData } = await supabase
    .from("catalog_items")
    .select("id, category_id, name, description, price, is_available, is_active, created_at, updated_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(200);

  const { data: ordersData, error: ordersError } = await supabase
    .from("orders")
    .select("id, customer_id, status, notes, subtotal, tax, discount, grand_total, created_at, updated_at, customers(full_name)")
    .order("created_at", { ascending: false })
    .limit(50);

  const orders = ((ordersData || []) as any[]).map((order) => ({
    ...order,
    customer_name: order.customers?.full_name ?? null
  })) as Order[];

  const orderIds = orders.map((order) => order.id);

  let paymentSummaryMap = new Map<string, { paid_amount: number; due_amount: number; payment_status: string }>();

  if (orderIds.length > 0) {
    const { data: paymentsData } = await supabase
      .from("payments")
      .select("order_id, amount, status")
      .in("order_id", orderIds);

    const grouped = new Map<string, { paid_amount: number; has_failed: boolean; has_pending: boolean }>();

    for (const payment of paymentsData || []) {
      const current = grouped.get(payment.order_id) || { paid_amount: 0, has_failed: false, has_pending: false };

      if (payment.status === "paid" || payment.status === "partial") {
        current.paid_amount += Number(payment.amount || 0);
      }
      if (payment.status === "failed") current.has_failed = true;
      if (payment.status === "pending") current.has_pending = true;

      grouped.set(payment.order_id, current);
    }

    paymentSummaryMap = new Map(
      orders.map((order) => {
        const summary = grouped.get(order.id) || { paid_amount: 0, has_failed: false, has_pending: false };
        const paid_amount = Number(summary.paid_amount.toFixed(2));
        const due_amount = Number((order.grand_total - paid_amount).toFixed(2));

        let payment_status = "pending";
        if (due_amount <= 0 && paid_amount > 0) payment_status = "paid";
        else if (paid_amount > 0 && due_amount > 0) payment_status = "partial";
        else if (summary.has_failed) payment_status = "failed";
        else if (summary.has_pending) payment_status = "pending";

        return [order.id, { paid_amount, due_amount: Math.max(0, due_amount), payment_status }];
      })
    );
  }

  const customers = (customersData || []) as Customer[];
  const items = (catalogItemsData || []) as CatalogItem[];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 p-6">
      <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="mt-2 text-slate-600">Create and track recent orders.</p>
      </header>

      <CreateOrderForm customers={customers} items={items} />

      <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-3 text-lg font-semibold">Recent Orders</h2>

        {ordersError ? <p className="text-sm text-red-600">{ordersError.message}</p> : null}

        <div className="grid gap-3">
          {orders.length === 0 ? (
            <p className="text-sm text-slate-500">No orders found.</p>
          ) : (
            orders.map((order) => {
              const paymentSummary = paymentSummaryMap.get(order.id);
              return (
                <article key={order.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500">Order #{order.id.slice(0, 8)}</p>
                      <p className="font-medium">Customer: {order.customer_name || "Walk-in / No customer"}</p>
                      <p className="text-sm text-slate-600">Subtotal: ${order.subtotal.toFixed(2)}</p>
                      <p className="text-sm text-slate-600">Tax: ${order.tax.toFixed(2)}</p>
                      <p className="text-sm text-slate-600">Discount: ${order.discount.toFixed(2)}</p>
                      <p className="text-sm font-semibold text-slate-800">Grand Total: ${order.grand_total.toFixed(2)}</p>

                      <p className="mt-1 text-sm text-slate-600">
                        Paid: ${paymentSummary?.paid_amount.toFixed(2) || "0.00"} • Due: ${paymentSummary?.due_amount.toFixed(2) || order.grand_total.toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">Payment status: {paymentSummary?.payment_status || "pending"}</p>

                      {order.notes ? <p className="mt-1 text-sm text-slate-500">Notes: {order.notes}</p> : null}
                    </div>

                    <div className="grid gap-2">
                      <OrderStatusBadge status={order.status} />
                      <UpdateOrderStatusForm order={order} />
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
