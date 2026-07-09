"use client";

import { useState, useTransition } from "react";
import { createCategory } from "@/app/dashboard/catalog/actions";

export function AddCategoryForm() {
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
          const result = await createCategory(formData);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setSuccess("Category added.");
        });
      }}
    >
      <h2 className="text-lg font-semibold">Add Category</h2>
      <input name="name" placeholder="Category name" className="rounded-lg border border-slate-300 px-3 py-2" required />
      <textarea name="description" placeholder="Description (optional)" className="rounded-lg border border-slate-300 px-3 py-2" rows={3} />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 disabled:opacity-70"
      >
        {isPending ? "Saving..." : "Save Category"}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-green-700">{success}</p> : null}
    </form>
  );
}
