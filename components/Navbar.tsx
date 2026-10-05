"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import LogoTani from "@/components/logo tanimaju.png";
import SignIn from "@/components/icon sign-in.png";

export type NavStatus = "active" | "soon";
export type NavItem = {
  label: string;
  href: string;
  status: NavStatus;
  fitur?: string;
  children?: NavItem[];
  // Path lain yang ikut menyalakan menu ini, mis. "/harga-pasar-login" -> "Harga Pasar".
  activePaths?: string[];
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Beranda", href: "/", status: "active" },
  { label: "Artikel", href: "/artikel", status: "active" },
  {
    label: "Harga Pasar",
    href: "/harga-pasar",
    status: "active",
    activePaths: ["/harga-pasar-login"],
  },
  { label: "Tentang", href: "/tentang", status: "active" },
  {
    label: "Info Obat",
    href: "/obat",
    status: "active",
    fitur: "obat",
    children: [
      { label: "Herbisida", href: "/obat/jenis/herbisida", status: "soon" },
      { label: "Insektisida", href: "/obat/jenis/insektisida", status: "soon" },
      { label: "Fungisida", href: "/obat/jenis/fungisida", status: "soon" },
      { label: "Akarisida", href: "/obat/jenis/akarisida", status: "soon" },
    ],
  },
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
    <header className="font-[family-name:var(--font-navbar)] sticky top-0 z-40 bg-[#084734] text-white shadow">
      {/* Kontainer Utama menggunakan Grid 3 Kolom pada Desktop */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* BAGIAN 1 (KIRI): LOGO */}
        <div className="flex items-center justify-start">
          <Link href="/" className="flex items-center text-lg -ml-10">
            <Image
              src={LogoTani}
              alt="Logo TaniMaju"
              width={128}
              height={32}
              className="h-[32px] w-[128px] object-contain"
            />
          </Link>
        </div>

        {/* BAGIAN 2 (TENGAH): MENU NAVIGASI DESKTOP */}
        <nav
          className="hidden items-center justify-center gap-1 md:flex"
          aria-label="Navigasi utama"
        >
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="group relative">
              <Link
                href={item.href}
                aria-disabled={item.status === "soon"}
                title={
                  item.status === "soon" ? "Segera hadir di Fase 2" : undefined
                }
                className={`flex items-center rounded-md px-3 py-1 text-sm font-medium hover:bg-[#CDEF7A] hover:text-black ${
                  (pathname === item.href.split("?")[0] ||
                    item.activePaths?.includes(pathname)) &&
                  item.status === "active"
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

        {/* BAGIAN 3 (KANAN): ELEMEN KANAN (Contoh: Tombol Login/Masuk) */}
        <div className="hidden items-center justify-end md:flex -mx-15">
          <Link
            href="/segera-hadir?fitur=login"
            className="flex items-center rounded-lg  px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-amber-400"
          >
            <Image
              src={SignIn}
              alt="Sign In"
              className="h-[15px] w-[17px] object-contain"
            />
            <p className="px-3 text-white text-18px">Sign In</p>
          </Link>
        </div>

        {/* TOMBOL HAMBURGER MOBILE (Tampil di kanan khusus tampilan HP) */}
        <button
          className="rounded p-2 text-white hover:bg-tani-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu"
          aria-expanded={open}
        >
          ☰
        </button>
      </div>

      {/* NAVIGASI SELULER (MOBILE) */}
      {open && (
        <nav
          className="border-t border-tani-700 px-4 pb-4 md:hidden"
          aria-label="Navigasi seluler"
        >
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
          {/* Tombol Login Mobile */}
          <div className="mt-3">
            <Link
              href="/segera-hadir?fitur=login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-lg bg-amber-500 py-2 text-sm font-semibold text-gray-900"
            >
              Login
              <SoonBadge />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
