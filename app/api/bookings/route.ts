import { NextResponse } from "next/server";

export const runtime = "nodejs";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const raw = await request.json();

    const booking = {
      name: clean(raw.name),
      whatsapp: clean(raw.whatsapp),
      email: clean(raw.email),
      eventDate: clean(raw.eventDate),
      eventType: clean(raw.eventType),
      packageName: clean(raw.packageName),
      message: clean(raw.message),
      status: "New",
    };

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { ok: false, message: "Supabase env variables missing." },
        { status: 500 }
      );
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/bookings`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(booking),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: "Booking save failed.",
          error: data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Booking saved successfully.",
      booking: data[0],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        message: "Booking server error.",
      },
      { status: 500 }
    );
  }
}