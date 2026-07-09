export default function DashboardPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 p-6">
      <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold">Operations Dashboard</h1>
        <p className="mt-2 text-slate-600">Phase 1 overview for daily business operations.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Today Orders", value: "0" },
          { label: "Pending", value: "0" },
          { label: "Completed", value: "0" },
          { label: "Revenue", value: "₹0" }
        ].map((card) => (
          <article key={card.label} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-bold">{card.value}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
