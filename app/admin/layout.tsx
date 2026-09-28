import Link from "next/link";
import { requireRole } from "@/modules/auth/auth.guard";

// Layout admin: guard ADMIN Fase 2.
// Guard server-side (proxy.ts hanya cek optimistis).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("ADMIN");
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <nav className="mb-6 flex gap-4 border-b pb-4 text-sm font-medium">
        <Link href="/admin/harga" className="hover:underline">
          Harga
        </Link>
        <Link href="/admin/artikel" className="hover:underline">
          Artikel
        </Link>
        <Link href="/admin/obat" className="hover:underline">
          Obat
        </Link>
      </nav>
      {children}
    </div>
  );
}
