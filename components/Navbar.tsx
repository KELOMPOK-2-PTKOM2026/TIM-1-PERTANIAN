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
  // Path lain yang harus menyalakan pill aktif untuk item ini, mis. route
  // "/harga-pasar-login" tetap menyalakan menu "Harga Pasar".
  activePaths?: string[];
};

// Varian navbar: "default" untuk halaman publik yang sudah ada,
// "harga" untuk desain /harga-pasar-login (menu+Tentang, tombol Sign In
// polos di kanan, logo lime, tanpa badge "Segera").
export type NavVariant = "default" | "harga";

// KUNCI PLAN: menu Fase 2 (info obat, login) tetap tampil dengan
// status "soon" -> Info Obat mengarah ke /obat (stub Fase 2),
// Login mengarah ke /segera-hadir (stub auth OAuth Google).
// Konsultasi TIDAK ada di navbar publik — hanya di dashboard (Fase 2, wajib login).
export const NAV_ITEMS: NavItem[] = [
  { label: "Beranda", href: "/", status: "active" },
  { label: "Artikel", href: "/artikel", status: "active" },
  {
    label: "Harga Pasar",
    href: "/harga-pasar",
    status: "active",
    activePaths: ["/harga-pasar-login"],
  },
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

// Susunan menu sesuai desain halaman Harga Pasar. Tidak ada "Login"
// karena sudah digantikan tombol "Sign In" di kanan navbar.
const NAV_ITEMS_HARGA: NavItem[] = [
  { label: "Beranda", href: "/", status: "active" },
  { label: "Artikel", href: "/artikel", status: "active" },
  {
    label: "Harga Pasar",
    href: "/harga-pasar",
    status: "active",
    activePaths: ["/harga-pasar-login"],
  },
  { label: "Tentang", href: "/segera-hadir?fitur=tentang", status: "active" },
  { label: "Info Obat", href: "/obat", status: "active", fitur: "obat" },
];

function SoonBadge() {
  return (
    <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
      Segera
    </span>
  );
}

function SignInIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="M10 17l5-5-5-5M15 12H3" />
    </svg>
  );
}

export default function Navbar({ variant = "default" }: { variant?: NavVariant }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isHarga = variant === "harga";
  const items = isHarga ? NAV_ITEMS_HARGA : NAV_ITEMS;
  // Desain halaman Harga Pasar tidak memuat badge "Segera".
  const badge = (item: NavItem) => !isHarga && item.status === "soon";

  const isActive = (item: NavItem) =>
    item.status === "active" &&
    (pathname === item.href.split("?")[0] ||
      item.activePaths?.includes(pathname) === true);

  return (
    <header
      className={`sticky top-0 z-40 text-white shadow ${
        isHarga
          ? "bg-gradient-to-r from-[#04382a] to-[#065f46]"
          : "bg-[#064e3b]"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {isHarga ? (
          // Logo file yang sama dengan Footer (public/tanimajulogo.png).
          <Link href="/" className="flex shrink-0 items-center">
            <img
              src="/tanimajulogo.png"
              alt="Tanimaju"
              className="h-9 w-auto sm:h-10"
            />
          </Link>
        ) : (
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-base font-bold sm:text-lg"
          >
            <span aria-hidden className="text-xl sm:text-2xl">
              🌾
            </span>
            TaniMaju
          </Link>
        )}

        <button
          className="-mr-2 rounded p-2 text-xl text-white hover:bg-white/10 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
        >
          ☰
        </button>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
          {items.map((item) => (
            <div key={item.label} className="group relative">
              <Link
                href={item.href}
                aria-disabled={item.status === "soon"}
                title={item.status === "soon" ? "Segera hadir di Fase 2" : undefined}
                className={`flex items-center rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive(item)
                    ? "bg-lime-300 font-semibold text-tani-950 hover:bg-lime-200"
                    : "text-white/90 hover:bg-white/10"
                } ${item.status === "soon" && !isHarga ? "cursor-not-allowed opacity-80" : ""}`}
              >
                {item.label}
                {badge(item) && <SoonBadge />}
              </Link>
              {item.children && (
                <div className="invisible absolute left-0 top-full w-48 rounded-b-lg bg-[#064e3b] p-1 opacity-0 shadow-lg group-hover:visible group-hover:opacity-100">
                  {item.children.map((c) => (
                    <Link
                      key={c.label}
                      href={c.href}
                      className="flex items-center rounded px-3 py-2 text-sm hover:bg-white/10"
                    >
                      {c.label}
                      <SoonBadge />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isHarga && (
            <Link
              href="/segera-hadir?fitur=login"
              className="ml-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white/95 transition hover:text-lime-300"
            >
              <SignInIcon className="shrink-0" />
              Sign In
            </Link>
          )}
        </nav>
      </div>

      {open && (
        <nav
          className="max-h-[calc(100dvh-3.25rem)] overflow-y-auto overscroll-contain border-t border-white/15 px-4 pb-4 md:hidden"
          aria-label="Navigasi seluler"
        >
          {items.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center border-b border-white/10 py-3 text-sm font-medium"
              >
                {item.label}
                {badge(item) && <SoonBadge />}
              </Link>
              {item.children?.map((c) => (
                <Link
                  key={c.label}
                  href={c.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center py-2 pl-4 text-sm text-emerald-50"
                >
                  ↳ {c.label}
                  <SoonBadge />
                </Link>
              ))}
            </div>
          ))}

          {isHarga && (
            <Link
              href="/segera-hadir?fitur=login"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold"
            >
              <SignInIcon />
              Sign In
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
