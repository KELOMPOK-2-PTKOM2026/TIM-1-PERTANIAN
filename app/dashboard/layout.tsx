import Link from "next/link";

// Layout dashboard: guard login Fase 2.
// TODO Fase 2: check session (Auth.js), redirect ke /login bila belum login.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <nav className="mb-6 flex gap-4 border-b pb-4 text-sm font-medium">
        <Link href="/dashboard/konsultasi" className="hover:underline">
          Konsultasi
        </Link>
        <Link href="/dashboard/konsultasi/arsip" className="hover:underline">
          Arsip Q&A
        </Link>
      </nav>
      {children}
    </div>
  );
}
