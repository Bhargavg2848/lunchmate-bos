import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardHomePage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { count } = await supabase.from("customers").select("id", { count: "exact", head: true });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 p-6">
      <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold">Operations Dashboard</h1>
        <p className="mt-2 text-slate-600">Signed in as: {user?.email}</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Customers</p>
          <p className="mt-2 text-2xl font-bold">{count ?? 0}</p>
        </article>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold">Modules</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/dashboard/customers" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white">
            Open Customers
          </Link>
        </div>
      </section>
    </main>
  );
}
