import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export default async function AdminIndex() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/dashboard");
  }

  redirect("/admin/login");
}
