import { NextResponse } from "next/server";
import {
  BookingPayload,
  BookingRecord,
  NotificationRecord,
  createId,
  readDatabase,
  writeDatabase,
} from "@/lib/bookingStore";

const requiredFields: Array<keyof BookingPayload> = [
  "name",
  "whatsapp",
  "email",
  "eventDate",
  "eventType",
  "packageName",
  "message",
];

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeWhatsAppNumber(value: string) {
  const normalized = value.replace(/[^\d+]/g, "");
  return normalized.startsWith("+") ? normalized : `+${normalized}`;
}

function confirmationText(payload: Required<BookingPayload>) {
  return `Hi ${payload.name}, your ${payload.packageName} package request for ${payload.eventType} on ${payload.eventDate} has been received. VantaFrame will contact you shortly to confirm availability and next steps.`;
}

async function saveBookingWithNotifications(payload: Required<BookingPayload>, message: string) {
  const createdAt = new Date().toISOString();
  const booking: BookingRecord = {
    id: createId("booking"),
    status: "New",
    createdAt,
    updatedAt: createdAt,
    ...payload,
  };

  const notifications: NotificationRecord[] = [
    {
      id: createId("notification"),
      bookingId: booking.id,
      channel: "email",
      recipient: payload.email,
      status: "pending",
      message,
      createdAt,
    },
    {
      id: createId("notification"),
      bookingId: booking.id,
      channel: "whatsapp",
      recipient: normalizeWhatsAppNumber(payload.whatsapp),
      status: "pending",
      message,
      createdAt,
    },
  ];

  const database = await readDatabase();
  database.bookings.unshift(booking);
  database.notifications.unshift(...notifications);
  await writeDatabase(database);

  return { booking, notifications };
}

async function updateNotifications(updatedNotifications: NotificationRecord[]) {
  const database = await readDatabase();
  const updatedById = new Map(updatedNotifications.map((notification) => [notification.id, notification]));
  database.notifications = database.notifications.map(
    (notification) => updatedById.get(notification.id) || notification,
  );
  await writeDatabase(database);
}

function emailSendingEnabled() {
  return process.env.ENABLE_EMAIL_CONFIRMATIONS === "true";
}

function whatsappSendingEnabled() {
  return process.env.ENABLE_WHATSAPP_CONFIRMATIONS === "true";
}

async function sendEmail(payload: Required<BookingPayload>, body: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONFIRMATION_EMAIL_FROM;

  if (!emailSendingEnabled() || !apiKey || !from) {
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: payload.email,
      subject: `VantaFrame booking confirmation - ${payload.packageName}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#151020">
          <h1>Your booking request is received</h1>
          <p>${body}</p>
          <p><strong>Package:</strong> ${payload.packageName}</p>
          <p><strong>Event:</strong> ${payload.eventType}</p>
          <p><strong>Date:</strong> ${payload.eventDate}</p>
          <p><strong>Message:</strong> ${payload.message}</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    throw new Error("Email confirmation could not be sent.");
  }

  return true;
}

async function sendWhatsApp(payload: Required<BookingPayload>, body: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const contentSid = process.env.TWILIO_CONTENT_SID;

  if (
    !whatsappSendingEnabled() ||
    !accountSid ||
    !authToken ||
    authToken === "[AuthToken]" ||
    !from
  ) {
    return false;
  }

  const params = new URLSearchParams(
    contentSid
      ? {
          From: `whatsapp:${from}`,
          To: `whatsapp:${normalizeWhatsAppNumber(payload.whatsapp)}`,
          ContentSid: contentSid,
          ContentVariables: JSON.stringify({
            "1": payload.eventDate,
            "2": payload.packageName,
          }),
        }
      : {
          From: `whatsapp:${from}`,
          To: `whatsapp:${normalizeWhatsAppNumber(payload.whatsapp)}`,
          Body: body,
        },
  );

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    },
  );

  if (!response.ok) {
    throw new Error("WhatsApp confirmation could not be sent.");
  }

  return true;
}

async function processNotification(
  notification: NotificationRecord,
  payload: Required<BookingPayload>,
) {
  try {
    const sent =
      notification.channel === "email"
        ? await sendEmail(payload, notification.message)
        : await sendWhatsApp(payload, notification.message);

    return {
      ...notification,
      status: sent ? "sent" : "disabled",
      sentAt: sent ? new Date().toISOString() : undefined,
    } satisfies NotificationRecord;
  } catch (error) {
    return {
      ...notification,
      status: "failed",
      error: error instanceof Error ? error.message : "Notification failed.",
    } satisfies NotificationRecord;
  }
}

export async function POST(request: Request) {
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

  const missingField = requiredFields.find((field) => !payload[field]);
  if (missingField) {
    return NextResponse.json(
      { ok: false, message: `Missing required field: ${missingField}` },
      { status: 400 },
    );
  }

  if (!payload.email.includes("@")) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const typedPayload = payload as Required<BookingPayload>;
  const confirmationMessage = confirmationText(typedPayload);
  const { booking, notifications } = await saveBookingWithNotifications(
    typedPayload,
    confirmationMessage,
  );

  const processedNotifications = await Promise.all(
    notifications.map((notification) => processNotification(notification, typedPayload)),
  );
  await updateNotifications(processedNotifications);

  return NextResponse.json({
    ok: true,
    bookingId: booking.id,
    notifications: processedNotifications.map((notification) => ({
      id: notification.id,
      channel: notification.channel,
      status: notification.status,
    })),
    emailSent: processedNotifications.some(
      (notification) => notification.channel === "email" && notification.status === "sent",
    ),
    whatsappSent: processedNotifications.some(
      (notification) => notification.channel === "whatsapp" && notification.status === "sent",
    ),
    message:
      "Package workflow completed. Booking saved and confirmation notification records created.",
  });
}
