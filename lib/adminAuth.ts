import { cookies } from "next/headers";

export const adminCookieName = "vantaframe_admin";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

export function getAdminSessionToken() {
  return process.env.ADMIN_SESSION_TOKEN || "local-admin-session";
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(adminCookieName)?.value === getAdminSessionToken();
}
