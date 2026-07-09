import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/types/order";
import type { Payment } from "@/lib/types/payment";
import { RecordPaymentForm } from "@/components/payments/record-payment-form";
import { PaymentsTable } from "@/components/payments/payments-table";

export default async function PaymentsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: ordersData } = await supabase
    .from("orders")
    .select("id, customer_id, status, notes, subtotal, tax, discount, grand_total, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: paymentsData, error: paymentsError } = await supabase
    .from("payments")
    .select("id, order_id, amount, method, status, transaction_ref, paid_at, notes, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const orders = (ordersData || []) as Order[];
  const payments = (paymentsData || []) as Payment[];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 p-6">
      <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="mt-2 text-slate-600">Record and track payment transactions by order.</p>
      </header>

      <RecordPaymentForm orders={orders} />

      <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-3 text-lg font-semibold">Recent Payments</h2>
        {paymentsError ? <p className="mb-3 text-sm text-red-600">{paymentsError.message}</p> : null}
        <PaymentsTable payments={payments} />
      </section>
    </main>
  );
}
