import { NextResponse } from "next/server";
import {
  LeadStatus,
  leadStatuses,
  readDatabase,
  updateBookingStatus,
} from "@/lib/bookingStore";
import { isAdminAuthenticated } from "@/lib/adminAuth";

const packageRevenue: Record<string, number> = {
  Silver: 9999,
  Gold: 19999,
  Platinum: 34999,
};

function matchesSearch(value: string, search: string) {
  return value.toLowerCase().includes(search.toLowerCase());
}

function getLeadValue(packageName: string) {
  return packageRevenue[packageName] || 0;
}

function createMetrics(bookings: Awaited<ReturnType<typeof readDatabase>>["bookings"]) {
  const statusCounts = leadStatuses.reduce(
    (counts, status) => ({ ...counts, [status]: bookings.filter((booking) => booking.status === status).length }),
    {} as Record<LeadStatus, number>,
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

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() || "";
  const status = searchParams.get("status")?.trim() || "";
  const packageName = searchParams.get("package")?.trim() || "";
  const date = searchParams.get("date")?.trim() || "";
  const database = await readDatabase();

  const filteredBookings = database.bookings.filter((booking) => {
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
    new Set(database.bookings.map((booking) => booking.packageName).filter(Boolean)),
  );

  return NextResponse.json({
    ok: true,
    bookings: filteredBookings,
    newCount: database.bookings.filter((booking) => booking.status === "New").length,
    totalCount: database.bookings.length,
    packageOptions,
    statusOptions: leadStatuses,
    metrics: createMetrics(database.bookings),
    filteredMetrics: createMetrics(filteredBookings),
  });
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  const { id, status } = (await request.json()) as { id?: string; status?: LeadStatus };

  if (!id || !status || !leadStatuses.includes(status)) {
    return NextResponse.json(
      { ok: false, message: "Invalid booking status update." },
      { status: 400 },
    );
  }

  const booking = await updateBookingStatus(id, status);
  if (!booking) {
    return NextResponse.json({ ok: false, message: "Booking not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, booking });
}