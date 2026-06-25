"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { BookingRecord, LeadStatus } from "@/lib/bookingStore";

type DashboardMetrics = {
  statusCounts: Record<LeadStatus, number>;
  pipelineRevenue: number;
  confirmedRevenue: number;
  cancelledRevenue: number;
  conversionRate: number;
  packageRevenue: Record<string, number>;
};

type DashboardResponse = {
  ok: boolean;
  bookings: BookingRecord[];
  newCount: number;
  totalCount: number;
  packageOptions: string[];
  statusOptions: LeadStatus[];
  metrics: DashboardMetrics;
  filteredMetrics: DashboardMetrics;
};

const fallbackStatuses: LeadStatus[] = ["New", "Contacted", "Confirmed", "Cancelled"];
const emptyMetrics: DashboardMetrics = {
  statusCounts: { New: 0, Contacted: 0, Confirmed: 0, Cancelled: 0 },
  pipelineRevenue: 0,
  confirmedRevenue: 0,
  cancelledRevenue: 0,
  conversionRate: 0,
  packageRevenue: { Silver: 9999, Gold: 19999, Platinum: 34999 },
};

function formatDate(value: string) {
  if (!value) return "-";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function statusClass(status: LeadStatus) {
  if (status === "Confirmed") return "border-emerald-400/40 bg-emerald-400/10 text-emerald-100";
  if (status === "Cancelled") return "border-red-400/40 bg-red-500/10 text-red-100";
  if (status === "Contacted") return "border-sky-400/40 bg-sky-400/10 text-sky-100";
  return "border-neon/40 bg-neon/10 text-frost";
}

export default function AdminDashboardClient() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [statusOptions, setStatusOptions] = useState<LeadStatus[]>(fallbackStatuses);
  const [packageOptions, setPackageOptions] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>(emptyMetrics);
  const [filteredMetrics, setFilteredMetrics] = useState<DashboardMetrics>(emptyMetrics);
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
    setMetrics(data.metrics || emptyMetrics);
    setFilteredMetrics(data.filteredMetrics || emptyMetrics);
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

    setMessage(`Lead moved to ${nextStatus}.`);
    await loadBookings();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function clearFilters() {
    setSearch("");
    setStatus("");
    setPackageName("");
    setDate("");
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
              Team Dashboard
            </p>
            <h1 className="mt-3 font-display text-4xl font-black uppercase leading-none md:text-6xl">
              Leads, Status & Revenue
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-smoke">
              Track every booking lead from new inquiry to confirmed shoot, cancelled lead, and expected revenue.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative border border-neon/40 bg-neon/10 px-4 py-3 text-sm font-bold text-frost">
              New bookings: <span className="text-neon">{newCount}</span>
              {newCount > 0 ? <span className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-neon shadow-neon" /> : null}
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

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="glass-panel p-5">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-neon">Pipeline Revenue</p>
            <h2 className="mt-4 font-display text-4xl font-black">{formatMoney(metrics.pipelineRevenue)}</h2>
            <p className="mt-2 text-sm text-smoke">All active non-cancelled leads</p>
          </div>
          <div className="glass-panel p-5">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-neon">Confirmed Revenue</p>
            <h2 className="mt-4 font-display text-4xl font-black">{formatMoney(metrics.confirmedRevenue)}</h2>
            <p className="mt-2 text-sm text-smoke">Booked and confirmed shoots</p>
          </div>
          <div className="glass-panel p-5">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-neon">Cancelled Value</p>
            <h2 className="mt-4 font-display text-4xl font-black">{formatMoney(metrics.cancelledRevenue)}</h2>
            <p className="mt-2 text-sm text-smoke">Lost or cancelled lead value</p>
          </div>
          <div className="glass-panel p-5">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-neon">Conversion</p>
            <h2 className="mt-4 font-display text-4xl font-black">{metrics.conversionRate}%</h2>
            <p className="mt-2 text-sm text-smoke">Confirmed / total leads</p>
          </div>
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-4">
          {statusOptions.map((option) => (
            <button
              key={option}
              onClick={() => setStatus(status === option ? "" : option)}
              className={`border px-4 py-4 text-left transition hover:-translate-y-0.5 ${statusClass(option)}`}
            >
              <p className="text-xs font-black uppercase tracking-[0.24em]">{option}</p>
              <p className="mt-3 font-display text-3xl font-black">{metrics.statusCounts[option] || 0}</p>
            </button>
          ))}
        </section>

        <section className="glass-panel mt-8 grid gap-3 p-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
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
          <button
            onClick={clearFilters}
            className="border border-white/15 px-4 py-3 text-sm font-black uppercase tracking-wider text-frost transition hover:border-neon hover:text-neon"
          >
            Clear
          </button>
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="border border-white/10 bg-white/5 p-4 text-sm text-smoke">
            Filtered leads: <span className="text-frost">{bookings.length}</span>
          </div>
          <div className="border border-white/10 bg-white/5 p-4 text-sm text-smoke">
            Filtered active value: <span className="text-frost">{formatMoney(filteredMetrics.pipelineRevenue)}</span>
          </div>
          <div className="border border-white/10 bg-white/5 p-4 text-sm text-smoke">
            Filtered confirmed: <span className="text-frost">{formatMoney(filteredMetrics.confirmedRevenue)}</span>
          </div>
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
                <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr_.9fr_.7fr_auto] xl:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-display text-3xl font-black uppercase leading-none">
                        {booking.name}
                      </h2>
                      <span className={`border px-3 py-1 text-xs font-black uppercase ${statusClass(booking.status)}`}>
                        {booking.status}
                      </span>
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
                  <div className="space-y-2 text-sm text-smoke">
                    <p><span className="text-frost">Lead value:</span> {formatMoney(metrics.packageRevenue[booking.packageName] || 0)}</p>
                    <p><span className="text-frost">Updated:</span> {formatDate(booking.updatedAt)}</p>
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