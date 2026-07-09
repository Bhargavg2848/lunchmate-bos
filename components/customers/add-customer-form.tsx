"use client";

import { useState, useTransition } from "react";
import { createCustomer } from "@/app/dashboard/customers/actions";

export function AddCustomerForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
      action={(formData) => {
        setError(null);
        setSuccess(null);
        startTransition(async () => {
          const result = await createCustomer(formData);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setSuccess("Customer added.");
        });
      }}
    >
      <h2 className="text-lg font-semibold">Add Customer</h2>
      <input name="full_name" placeholder="Full name" className="rounded-lg border border-slate-300 px-3 py-2" required />
      <input name="phone" placeholder="Phone" className="rounded-lg border border-slate-300 px-3 py-2" required />
      <input name="email" placeholder="Email (optional)" className="rounded-lg border border-slate-300 px-3 py-2" />
      <textarea name="notes" placeholder="Notes (optional)" className="rounded-lg border border-slate-300 px-3 py-2" rows={3} />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 disabled:opacity-70"
      >
        {isPending ? "Saving..." : "Save Customer"}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-green-700">{success}</p> : null}
    </form>
  );
}
