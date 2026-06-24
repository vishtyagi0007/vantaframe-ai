"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      setLoading(false);
      setError("Invalid admin password.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-radial-lux px-4 py-20">
      <form onSubmit={handleSubmit} className="glass-panel w-full max-w-md p-6">
        <p className="font-display text-xs font-black uppercase tracking-[0.3em] text-neon">
          Admin Access
        </p>
        <h1 className="mt-4 font-display text-4xl font-black uppercase leading-none text-frost">
          Lead Dashboard
        </h1>
        <p className="mt-4 text-sm leading-7 text-smoke">
          Login to view package bookings, update lead status, and manage new inquiries.
        </p>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="Admin password"
          className="mt-8 w-full border border-white/10 bg-ink/80 px-4 py-4 text-sm text-frost outline-none transition placeholder:text-smoke focus:border-neon"
          required
        />
        {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
        <button
          disabled={loading}
          className="mt-5 w-full bg-neon px-5 py-4 text-sm font-black uppercase tracking-wider text-white shadow-neon transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Checking..." : "Login"}
        </button>
      </form>
    </main>
  );
}
