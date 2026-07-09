import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 p-6">
      <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Lunchmate BOS</h1>
        <p className="mt-2 text-slate-600">Fast, mobile-first POS for growing food businesses.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <Link href="/auth/login" className="rounded-xl bg-brand-600 p-5 text-white shadow-sm transition hover:bg-brand-700">
          <h2 className="text-lg font-semibold">Go to Login</h2>
          <p className="mt-1 text-sm text-brand-100">Authenticate staff and admins</p>
        </Link>

        <Link href="/dashboard" className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100">
          <h2 className="text-lg font-semibold">Open Dashboard</h2>
          <p className="mt-1 text-sm text-slate-600">View modules and operations</p>
        </Link>
      </section>
    </main>
  );
}
