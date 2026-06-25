import { NextResponse } from "next/server";
import type { BookingPayload } from "@/lib/bookingStore";

export const runtime = "nodejs";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const rawPayload = (await request.json()) as BookingPayload;

    const payload = {
      name: clean(rawPayload.name),
      whatsapp: clean(rawPayload.whatsapp),
      email: clean(rawPayload.email),
      eventDate: clean(rawPayload.eventDate),
      eventType: clean(rawPayload.eventType),
      packageName: clean(rawPayload.packageName),
      message: clean(rawPayload.message),
    };

    if (
      !payload.name ||
      !payload.whatsapp ||
      !payload.email ||
      !payload.eventDate ||
      !payload.eventType ||
      !payload.packageName ||
      !payload.message
    ) {
      return NextResponse.json(
        { ok: false, message: "Please fill all required fields." },
        { status: 400 }
      );
    }

    if (!payload.email.includes("@")) {
      return NextResponse.json(
        { ok: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    console.log("New booking received:", payload);

    return NextResponse.json({
      ok: true,
      message:
        "Booking request received successfully. Our team will contact you shortly.",
      booking: payload,
    });
  } catch (error) {
    console.error("Booking API crashed:", error);

    return NextResponse.json(
      { ok: false, message: "Booking server error. Please contact us on WhatsApp." },
      { status: 500 }
    );
  }
}