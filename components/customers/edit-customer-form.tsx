"use client";

import { useState, useTransition } from "react";
import type { Customer } from "@/lib/types/customer";
import { updateCustomer } from "@/app/dashboard/customers/actions";

export function EditCustomerForm({ customer }: { customer: Customer }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white"
      >
        {open ? "Close Edit" : "Edit"}
      </button>

      {open ? (
        <form
          className="mt-3 grid gap-2"
          action={(formData) => {
            setError(null);
            setSuccess(null);
            startTransition(async () => {
              const result = await updateCustomer(formData);
              if (!result.ok) {
                setError(result.error);
                return;
              }
              setSuccess("Customer updated.");
            });
          }}
        >
          <input type="hidden" name="id" value={customer.id} />
          <input
            name="full_name"
            defaultValue={customer.full_name}
            className="rounded-lg border border-slate-300 px-3 py-2"
            required
          />
          <input
            name="phone"
            defaultValue={customer.phone}
            className="rounded-lg border border-slate-300 px-3 py-2"
            required
          />
          <input
            name="email"
            defaultValue={customer.email ?? ""}
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
          <textarea
            name="notes"
            defaultValue={customer.notes ?? ""}
            className="rounded-lg border border-slate-300 px-3 py-2"
            rows={2}
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-70"
          >
            {isPending ? "Updating..." : "Update"}
          </button>
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          {success ? <p className="text-xs text-green-700">{success}</p> : null}
        </form>
      ) : null}
    </div>
  );
}
