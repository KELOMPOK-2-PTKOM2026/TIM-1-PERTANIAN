import Link from "next/link";
import { requireUser } from "@/modules/auth/auth.guard";
import { logoutAction } from "@/modules/auth/auth.actions";

// Layout dashboard: guard login Fase 2.
// Guard server-side (proxy.ts hanya cek optimistis).
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <nav className="mb-6 flex gap-4 border-b pb-4 text-sm font-medium">
        <Link href="/dashboard/konsultasi" className="hover:underline">
          Konsultasi
        </Link>
        <Link href="/dashboard/konsultasi/arsip" className="hover:underline">
          Arsip Q&A
        </Link>
        <form action={logoutAction} className="ml-auto flex items-center gap-3">
          <span className="text-stone-600">{user.name}</span>
          <button type="submit" className="hover:underline">
            Logout
          </button>
        </form>
      </nav>
      {children}
    </div>
  );
}
