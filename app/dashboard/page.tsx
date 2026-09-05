import { redirect } from "next/navigation";

// TODO Fase 2: tampilkan ringkasan akun + redirect default.
export default function DashboardPage() {
  redirect("/dashboard/konsultasi");
}
