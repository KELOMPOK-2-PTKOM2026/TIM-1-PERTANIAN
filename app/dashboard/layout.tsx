import AdminShell, { type ShellMenuItem } from "@/components/features/admin/AdminShell";
import { ADMIN_ICON } from "@/components/features/admin/ui";
import { requireUser } from "@/modules/auth/auth.guard";

// Layout dashboard: guard login Fase 2, tampilan sidebar sama dengan admin.
// Guard server-side (proxy.ts hanya cek optimistis).
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const menu: ShellMenuItem[] = [
    { label: "Konsultasi", href: "/dashboard/konsultasi", icon: ADMIN_ICON.chat },
    { label: "Arsip Q&A", href: "/dashboard/konsultasi/arsip", icon: ADMIN_ICON.archive },
  ];
  if (user.role === "PAKAR" || user.role === "ADMIN") {
    menu.push({ label: "Jawab Pertanyaan", href: "/dashboard/konsultasi/jawab", icon: ADMIN_ICON.edit });
  }
  if (user.role === "ADMIN") {
    menu.push({ label: "Admin CMS", href: "/admin", icon: ADMIN_ICON.grid });
  }

  return (
    <AdminShell
      user={{ name: user.name, email: user.email }}
      menu={menu}
      home="/dashboard/konsultasi"
      label={user.role === "PETANI" ? "Dashboard Petani" : "Dashboard Pakar"}
    >
      {children}
    </AdminShell>
  );
}
