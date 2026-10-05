import AdminShell from "@/components/features/admin/AdminShell";
import { requireRole } from "@/modules/auth/auth.guard";

// Layout admin CMS: guard ADMIN server-side (proxy.ts hanya cek optimistis).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("ADMIN");
  return <AdminShell user={{ name: user.name, email: user.email }}>{children}</AdminShell>;
}
