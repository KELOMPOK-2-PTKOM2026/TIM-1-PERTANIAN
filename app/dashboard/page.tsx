import { redirect } from "next/navigation";
import { requireUser } from "@/modules/auth/auth.guard";

// Arah default setelah login: ADMIN ke CMS, lainnya ke konsultasi.
export default async function DashboardPage() {
  const user = await requireUser();
  redirect(user.role === "ADMIN" ? "/admin" : "/dashboard/konsultasi");
}
