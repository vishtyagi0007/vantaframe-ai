import { NextResponse } from "next/server";

export const runtime = "nodejs";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function sendAdminEmail(booking: any) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!apiKey || !adminEmail) {
    console.log("Email skipped: RESEND_API_KEY or ADMIN_EMAIL missing.");
    return false;
  }

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "VantaFrame <onboarding@resend.dev>",
      to: adminEmail,
      subject: `New Booking Lead - ${booking.packageName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New Booking Lead</h2>
          <p><strong>Name:</strong> ${booking.name}</p>
          <p><strong>WhatsApp:</strong> ${booking.whatsapp}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Event Date:</strong> ${booking.eventDate}</p>
          <p><strong>Event Type:</strong> ${booking.eventType}</p>
          <p><strong>Package:</strong> ${booking.packageName}</p>
          <p><strong>Message:</strong> ${booking.message}</p>
        </div>
      `,
    }),
  });

  if (!emailResponse.ok) {
    const errorText = await emailResponse.text();
    console.error("Resend email error:", errorText);
    return false;
  }

  return true;
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

    if (
      !booking.name ||
      !booking.whatsapp ||
      !booking.email ||
      !booking.eventDate ||
      !booking.eventType ||
      !booking.packageName ||
      !booking.message
    ) {
      return NextResponse.json(
        { ok: false, message: "Please fill all required fields." },
        { status: 400 }
      );
    }

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
        { ok: false, message: "Booking save failed.", error: data },
        { status: 500 }
      );
    }

    const emailSent = await sendAdminEmail(data[0]);

    return NextResponse.json({
      ok: true,
      message: "Booking saved successfully with admin email.",
      booking: data[0],
      emailSent,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { ok: false, message: "Booking server error." },
      { status: 500 }
    );
  }
}