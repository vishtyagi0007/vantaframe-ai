import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";

type LeadStatus = "New" | "Contacted" | "Confirmed" | "Cancelled";

const leadStatuses: LeadStatus[] = ["New", "Contacted", "Confirmed", "Cancelled"];

const packageRevenue: Record<string, number> = {
  Silver: 9999,
  Gold: 19999,
  Platinum: 34999,
};

type BookingRecord = {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  eventDate: string;
  eventType: string;
  packageName: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
};

function matchesSearch(value: string | null | undefined, search: string) {
  return String(value || "").toLowerCase().includes(search.toLowerCase());
}

function getLeadValue(packageName: string) {
  return packageRevenue[packageName] || 0;
}

function createMetrics(bookings: BookingRecord[]) {
  const statusCounts = leadStatuses.reduce(
    (counts, status) => ({
      ...counts,
      [status]: bookings.filter((booking) => booking.status === status).length,
    }),
    {} as Record<LeadStatus, number>
  );

  const pipelineRevenue = bookings
    .filter((booking) => booking.status !== "Cancelled")
    .reduce((sum, booking) => sum + getLeadValue(booking.packageName), 0);

  const confirmedRevenue = bookings
    .filter((booking) => booking.status === "Confirmed")
    .reduce((sum, booking) => sum + getLeadValue(booking.packageName), 0);

  const cancelledRevenue = bookings
    .filter((booking) => booking.status === "Cancelled")
    .reduce((sum, booking) => sum + getLeadValue(booking.packageName), 0);

  const conversionRate = bookings.length
    ? Math.round((statusCounts.Confirmed / bookings.length) * 100)
    : 0;

  return {
    statusCounts,
    pipelineRevenue,
    confirmedRevenue,
    cancelledRevenue,
    conversionRate,
    packageRevenue,
  };
}

async function supabaseRequest(path: string, options: RequestInit = {}) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase env variables missing.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    console.error("Supabase admin API error:", data);
    throw new Error(data?.message || "Supabase request failed.");
  }

  return data;
}

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() || "";
  const status = searchParams.get("status")?.trim() || "";
  const packageName = searchParams.get("package")?.trim() || "";
  const date = searchParams.get("date")?.trim() || "";

  try {
    const bookings = (await supabaseRequest(
      'bookings?select=*&order=createdAt.desc'
    )) as BookingRecord[];

    const filteredBookings = bookings.filter((booking) => {
      const searchMatched =
        !search ||
        [
          booking.name,
          booking.whatsapp,
          booking.email,
          booking.packageName,
          booking.eventDate,
          booking.message,
          booking.eventType,
        ].some((value) => matchesSearch(value, search));

      const statusMatched = !status || booking.status === status;
      const packageMatched = !packageName || booking.packageName === packageName;
      const dateMatched = !date || booking.eventDate === date;

      return searchMatched && statusMatched && packageMatched && dateMatched;
    });

    const packageOptions = Array.from(
      new Set(bookings.map((booking) => booking.packageName).filter(Boolean))
    );

    return NextResponse.json({
      ok: true,
      bookings: filteredBookings,
      newCount: bookings.filter((booking) => booking.status === "New").length,
      totalCount: bookings.length,
      packageOptions,
      statusOptions: leadStatuses,
      metrics: createMetrics(bookings),
      filteredMetrics: createMetrics(filteredBookings),
    });
  } catch (error) {
    console.error("Admin bookings GET error:", error);

    return NextResponse.json(
      { ok: false, message: "Could not load bookings." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  const { id, status } = (await request.json()) as {
    id?: string;
    status?: LeadStatus;
  };

  if (!id || !status || !leadStatuses.includes(status)) {
    return NextResponse.json(
      { ok: false, message: "Invalid booking status update." },
      { status: 400 }
    );
  }

  try {
    const updated = (await supabaseRequest(`bookings?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status,
        updatedAt: new Date().toISOString(),
      }),
    })) as BookingRecord[];

    if (!updated?.length) {
      return NextResponse.json({ ok: false, message: "Booking not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, booking: updated[0] });
  } catch (error) {
    console.error("Admin bookings PATCH error:", error);

    return NextResponse.json(
      { ok: false, message: "Could not update booking status." },
      { status: 500 }
    );
  }
}