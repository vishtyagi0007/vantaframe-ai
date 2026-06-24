"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { BookingRecord, LeadStatus } from "@/lib/bookingStore";

type DashboardResponse = {
  ok: boolean;
  bookings: BookingRecord[];
  newCount: number;
  totalCount: number;
  packageOptions: string[];
  statusOptions: LeadStatus[];
};

const fallbackStatuses: LeadStatus[] = ["New", "Contacted", "Confirmed", "Cancelled"];

function formatDate(value: string) {
  if (!value) return "-";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export default function AdminDashboardClient() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [statusOptions, setStatusOptions] = useState<LeadStatus[]>(fallbackStatuses);
  const [packageOptions, setPackageOptions] = useState<string[]>([]);
  const [newCount, setNewCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [packageName, setPackageName] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (packageName) params.set("package", packageName);
    if (date) params.set("date", date);
    return params.toString();
  }, [date, packageName, search, status]);

  async function loadBookings() {
    setLoading(true);
    const response = await fetch(`/api/admin/bookings${query ? `?${query}` : ""}`, {
      cache: "no-store",
    });

    if (response.status === 401) {
      router.push("/admin/login");
      return;
    }

    const data = (await response.json()) as DashboardResponse;
    setBookings(data.bookings || []);
    setNewCount(data.newCount || 0);
    setTotalCount(data.totalCount || 0);
    setPackageOptions(data.packageOptions || []);
    setStatusOptions(data.statusOptions || fallbackStatuses);
    setLoading(false);
  }

  async function updateStatus(id: string, nextStatus: LeadStatus) {
    setMessage("");
    const response = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: nextStatus }),
    });

    if (!response.ok) {
      setMessage("Could not update lead status.");
      return;
    }

    setMessage("Lead status updated.");
    await loadBookings();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  useEffect(() => {
    loadBookings();
  }, [query]);

  return (
    <main className="min-h-screen bg-radial-lux px-4 py-8 text-frost md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-xs font-black uppercase tracking-[0.3em] text-neon">
              Admin Dashboard
            </p>
            <h1 className="mt-3 font-display text-4xl font-black uppercase leading-none md:text-6xl">
              Booking Leads
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="border border-neon/40 bg-neon/10 px-4 py-3 text-sm font-bold text-frost">
              New bookings: <span className="text-neon">{newCount}</span>
            </div>
            <div className="border border-white/10 bg-white/5 px-4 py-3 text-sm text-smoke">
              Total leads: {totalCount}
            </div>
            <button
              onClick={logout}
              className="border border-white/15 px-4 py-3 text-sm font-black uppercase tracking-wider text-frost transition hover:border-neon hover:text-neon"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="glass-panel mt-8 grid gap-3 p-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, phone, email, message..."
            className="border border-white/10 bg-ink/80 px-4 py-3 text-sm outline-none placeholder:text-smoke focus:border-neon"
          />
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="border border-white/10 bg-ink/80 px-4 py-3 text-sm text-smoke outline-none focus:border-neon"
          >
            <option value="">All statuses</option>
            {statusOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <select
            value={packageName}
            onChange={(event) => setPackageName(event.target.value)}
            className="border border-white/10 bg-ink/80 px-4 py-3 text-sm text-smoke outline-none focus:border-neon"
          >
            <option value="">All packages</option>
            {packageOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <input
            value={date}
            onChange={(event) => setDate(event.target.value)}
            type="date"
            className="border border-white/10 bg-ink/80 px-4 py-3 text-sm text-smoke outline-none focus:border-neon"
          />
        </section>

        {message ? (
          <p className="mt-4 border border-neon/30 bg-neon/10 px-4 py-3 text-sm text-frost">
            {message}
          </p>
        ) : null}

        <section className="mt-6 grid gap-4">
          {loading ? (
            <div className="glass-panel p-6 text-sm text-smoke">Loading leads...</div>
          ) : bookings.length === 0 ? (
            <div className="glass-panel p-6 text-sm text-smoke">No leads match these filters.</div>
          ) : (
            bookings.map((booking) => (
              <article key={booking.id} className="glass-panel p-5">
                <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-display text-3xl font-black uppercase leading-none">
                        {booking.name}
                      </h2>
                      {booking.status === "New" ? (
                        <span className="rounded-full bg-neon px-3 py-1 text-xs font-black uppercase text-white shadow-neon">
                          New
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-smoke">{booking.message}</p>
                  </div>
                  <div className="space-y-2 text-sm text-smoke">
                    <p><span className="text-frost">Phone:</span> {booking.whatsapp}</p>
                    <p><span className="text-frost">Email:</span> {booking.email}</p>
                    <p><span className="text-frost">Created:</span> {formatDate(booking.createdAt)}</p>
                  </div>
                  <div className="space-y-2 text-sm text-smoke">
                    <p><span className="text-frost">Package:</span> {booking.packageName}</p>
                    <p><span className="text-frost">Event:</span> {booking.eventType}</p>
                    <p><span className="text-frost">Date:</span> {booking.eventDate}</p>
                  </div>
                  <select
                    value={booking.status}
                    onChange={(event) => updateStatus(booking.id, event.target.value as LeadStatus)}
                    className="border border-white/10 bg-ink/80 px-4 py-3 text-sm text-smoke outline-none focus:border-neon"
                  >
                    {statusOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
