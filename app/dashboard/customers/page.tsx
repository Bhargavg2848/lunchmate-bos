import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Customer } from "@/lib/types/customer";
import { AddCustomerForm } from "@/components/customers/add-customer-form";
import { EditCustomerForm } from "@/components/customers/edit-customer-form";

export default async function CustomersPage({
  searchParams
}: {
  searchParams: { q?: string };
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const q = (searchParams.q || "").trim();

  let query = supabase
    .from("customers")
    .select("id, full_name, phone, email, notes, is_active, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (q) {
    query = query.or(`full_name.ilike.%${q}%,phone.ilike.%${q}%`);
  }

  const { data, error } = await query;

  const customers = (data || []) as Customer[];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 p-6">
      <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="mt-2 text-slate-600">Manage customer records and quick search by name/phone.</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <AddCustomerForm />

        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <form className="mb-4">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by name or phone"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </form>

          {error ? <p className="text-sm text-red-600">{error.message}</p> : null}

          <div className="grid gap-3">
            {customers.length === 0 ? (
              <p className="text-sm text-slate-500">No customers found.</p>
            ) : (
              customers.map((customer) => (
                <article key={customer.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{customer.full_name}</h3>
                      <p className="text-sm text-slate-600">{customer.phone}</p>
                      {customer.email ? <p className="text-sm text-slate-500">{customer.email}</p> : null}
                      {customer.notes ? <p className="mt-1 text-sm text-slate-500">{customer.notes}</p> : null}
                    </div>
                    <EditCustomerForm customer={customer} />
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
