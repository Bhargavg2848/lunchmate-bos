"use client";

import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("Login integration with Supabase Auth will be connected in next step.");
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center p-6">
      <div className="w-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-xl font-bold">Staff Login</h1>
        <p className="mt-1 text-sm text-slate-600">Use your work email to continue</p>

        <form className="mt-5 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-brand-500 focus:ring"
              placeholder="you@business.com"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700"
          >
            Continue
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
      </div>
    </main>
  );
}
