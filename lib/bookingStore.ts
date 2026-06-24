import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type LeadStatus = "New" | "Contacted" | "Confirmed" | "Cancelled";

export type BookingPayload = {
  name?: string;
  whatsapp?: string;
  email?: string;
  eventDate?: string;
  eventType?: string;
  packageName?: string;
  message?: string;
};

export type BookingRecord = Required<BookingPayload> & {
  id: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
};

export type NotificationRecord = {
  id: string;
  bookingId: string;
  channel: "email" | "whatsapp";
  recipient: string;
  status: "pending" | "sent" | "disabled" | "failed";
  message: string;
  createdAt: string;
  sentAt?: string;
  error?: string;
};

export type Database = {
  bookings: BookingRecord[];
  notifications: NotificationRecord[];
};

export const leadStatuses: LeadStatus[] = ["New", "Contacted", "Confirmed", "Cancelled"];

const databasePath = path.join(process.cwd(), "work", "booking-database.json");

export function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;
}

function normalizeBooking(record: Partial<BookingRecord>): BookingRecord {
  const createdAt = record.createdAt || new Date().toISOString();

  return {
    id: record.id || createId("booking"),
    name: record.name || "",
    whatsapp: record.whatsapp || "",
    email: record.email || "",
    eventDate: record.eventDate || "",
    eventType: record.eventType || "",
    packageName: record.packageName || "",
    message: record.message || "",
    status: leadStatuses.includes(record.status as LeadStatus)
      ? (record.status as LeadStatus)
      : "New",
    createdAt,
    updatedAt: record.updatedAt || createdAt,
  };
}

export async function readDatabase(): Promise<Database> {
  try {
    const file = await readFile(databasePath, "utf8");
    const parsed = JSON.parse(file) as Partial<Database>;

    return {
      bookings: (parsed.bookings || []).map(normalizeBooking),
      notifications: parsed.notifications || [],
    };
  } catch {
    return { bookings: [], notifications: [] };
  }
}

export async function writeDatabase(database: Database) {
  await mkdir(path.dirname(databasePath), { recursive: true });
  await writeFile(databasePath, `${JSON.stringify(database, null, 2)}\n`);
}

export async function updateBookingStatus(id: string, status: LeadStatus) {
  const database = await readDatabase();
  const booking = database.bookings.find((item) => item.id === id);

  if (!booking) {
    return null;
  }

  booking.status = status;
  booking.updatedAt = new Date().toISOString();
  await writeDatabase(database);
  return booking;
}
