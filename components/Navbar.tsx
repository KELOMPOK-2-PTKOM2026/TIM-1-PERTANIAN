"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export type NavStatus = "active" | "soon";
export type NavItem = {
  label: string;
  href: string;
  status: NavStatus;
  fitur?: string;
  children?: NavItem[];
};

// KUNCI PLAN: menu Fase 2 (info obat, login) tetap tampil dengan
// status "soon" -> Info Obat mengarah ke /obat (stub Fase 2),
// Login mengarah ke /segera-hadir (stub auth OAuth Google).
// Konsultasi TIDAK ada di navbar publik — hanya di dashboard (Fase 2, wajib login).
export const NAV_ITEMS: NavItem[] = [
  { label: "Beranda", href: "/", status: "active" },
  { label: "Artikel", href: "/artikel", status: "active" },
  { label: "Harga Pasar", href: "/harga-pasar", status: "active" },
  {
    label: "Info Obat",
    href: "/obat",
    status: "soon",
    fitur: "obat",
    children: [
      { label: "Herbisida", href: "/obat/jenis/herbisida", status: "soon" },
      { label: "Insektisida", href: "/obat/jenis/insektisida", status: "soon" },
      { label: "Fungisida", href: "/obat/jenis/fungisida", status: "soon" },
      { label: "Akarisida", href: "/obat/jenis/akarisida", status: "soon" },
    ],
  },
  { label: "Login", href: "/segera-hadir?fitur=login", status: "soon", fitur: "login" },
];

function SoonBadge() {
  return (
    <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
      Segera
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-tani-800 text-white shadow">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span aria-hidden className="text-2xl">
            🌾
          </span>
          TaniMaju
        </Link>
        <button
          className="rounded p-2 text-white hover:bg-tani-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu"
          aria-expanded={open}
        >
          ☰
        </button>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="group relative">
              <Link
                href={item.href}
                aria-disabled={item.status === "soon"}
                title={item.status === "soon" ? "Segera hadir di Fase 2" : undefined}
                className={`flex items-center rounded px-3 py-2 text-sm font-medium hover:bg-tani-700 ${
                  pathname === item.href.split("?")[0] && item.status === "active"
                    ? "bg-tani-700"
                    : ""
                } ${item.status === "soon" ? "cursor-not-allowed opacity-80" : ""}`}
              >
                {item.label}
                {item.status === "soon" && <SoonBadge />}
              </Link>
              {item.children && (
                <div className="invisible absolute left-0 top-full w-48 rounded-b-lg bg-tani-800 p-1 opacity-0 shadow-lg group-hover:visible group-hover:opacity-100">
                  {item.children.map((c) => (
                    <Link
                      key={c.label}
                      href={c.href}
                      className="flex items-center rounded px-3 py-2 text-sm hover:bg-tani-700"
                    >
                      {c.label}
                      <SoonBadge />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
      {open && (
        <nav className="border-t border-tani-700 px-4 pb-4 md:hidden" aria-label="Navigasi seluler">
          {NAV_ITEMS.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center border-b border-tani-700/60 py-3 text-sm font-medium"
              >
                {item.label}
                {item.status === "soon" && <SoonBadge />}
              </Link>
              {item.children?.map((c) => (
                <Link
                  key={c.label}
                  href={c.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center py-2 pl-4 text-sm text-tani-100"
                >
                  ↳ {c.label}
                  <SoonBadge />
                </Link>
              ))}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}
