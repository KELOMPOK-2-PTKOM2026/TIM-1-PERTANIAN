"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/modules/auth/auth.actions";
import { AdminIcon, ADMIN_ICON } from "./ui";

// Menu mengikuti tab navbar publik (Artikel, Harga Pasar, Info Obat, Tentang) + Dashboard & Pengaturan.
const MENU = [
  { label: "Dashboard", href: "/admin", icon: ADMIN_ICON.grid },
  { label: "Artikel", href: "/admin/artikel", icon: ADMIN_ICON.doc },
  { label: "Harga Pasar", href: "/admin/harga", icon: ADMIN_ICON.trend },
  { label: "Info Obat", href: "/admin/obat", icon: ADMIN_ICON.flask },
  { label: "Tentang", href: "/admin/tentang", icon: ADMIN_ICON.info },
  { label: "Pengaturan", href: "/admin/pengaturan", icon: ADMIN_ICON.gear },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AdminShell({
  user,
  children,
}: {
  user: { name: string; email: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <div className="flex min-h-screen bg-[#f6f8f4]">
      {open && (
        <button
          aria-label="Tutup menu"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#084734] text-white transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-6">
          <Link href="/admin" className="block">
            <span className="block text-2xl font-extrabold tracking-tight">Tanimaju</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#CDEF7A]">Admin CMS</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-4" aria-label="Navigasi admin">
          {MENU.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive(m.href) ? "bg-[#CDEF7A] text-[#084734]" : "text-white/85 hover:bg-white/10"
              }`}
            >
              <AdminIcon d={m.icon} className="h-5 w-5" />
              {m.label}
            </Link>
          ))}
          <Link
            href="/"
            className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/10"
          >
            <AdminIcon d={ADMIN_ICON.external} className="h-5 w-5" />
            Lihat situs
          </Link>
        </nav>
        <div className="m-4 flex items-center gap-3 rounded-xl bg-white/10 p-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#CDEF7A] text-sm font-bold text-[#084734]">
            {initials(user.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-white/60">{user.email}</p>
          </div>
          <form action={logoutAction}>
            <button type="submit" title="Keluar" className="rounded p-1.5 hover:bg-white/10">
              <AdminIcon d={ADMIN_ICON.logout} className="h-5 w-5" />
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-stone-200 bg-white/80 px-4 py-3 backdrop-blur md:hidden">
          <button
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
            className="rounded-lg p-2 text-[#084734] hover:bg-stone-100"
          >
            <AdminIcon d={ADMIN_ICON.menu} className="h-5 w-5" />
          </button>
          <span className="font-bold text-[#084734]">Tanimaju Admin</span>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
