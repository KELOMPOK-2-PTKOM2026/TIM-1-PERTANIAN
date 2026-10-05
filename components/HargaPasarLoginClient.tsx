"use client";

import { useMemo, useState } from "react";

import {
  JUMLAH_AWAL,
  KOMODITAS_LOGIN,
  KOMODITAS_UTAMA,
  KONDISI_PASAR,
  OPSI_FILTER_LOGIN,
  OPSI_PILL,
  PASAR_AKTIF,
  RINGKASAN_LOGIN,
  TANGGAL_HARI_INI,
  trenDari,
  type KomoditasHargaLogin,
  type TrenHarga,
} from "@/lib/mock-harga-pasar-login";
import { formatRupiah } from "@/lib/format";

function PinIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M21 12a9 9 0 1 1-2.6-6.4" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

// Ikon gedung pasar untuk kartu lokasi di hero.
function MarketIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 9.5 4.6 4.6A1 1 0 0 1 5.54 4h12.92a1 1 0 0 1 .94.6L21 9.5" />
      <path d="M3 9.5h18" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M10 20v-5h4v5" />
      <path d="M8 4V2.5M16 4V2.5" />
    </svg>
  );
}

// Ikon slider/filter untuk judul "Filter Pasar & Waktu".
// Ikon centanglingkaran untuk baris kondisi pasar di kotak ringkasan.
function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M21.8 10.6V12a10 10 0 1 1-5.9-9.1" />
      <path d="M9 11l3 3L22 4" />
    </svg>
  );
}

function SlidersIcon({ className }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h10M18 18h2" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="10" cy="12" r="2" />
      <circle cx="16" cy="18" r="2" />
    </svg>
  );
}

// change === 0 -> "stabil" (netral, bukan naik/turun)
function TrenBadge({ change }: { change: number }) {
  if (change === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-bold text-stone-600">
        Stabil
      </span>
    );
  }

  const up = change > 0;

  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
        up ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
      }`}
    >
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {up ? <path d="M12 19V5M5 12l7-7 7 7" /> : <path d="M12 5v14M19 12l-7 7-7-7" />}
      </svg>
      {Math.abs(change).toFixed(1)}%
    </span>
  );
}

const TREN_LABEL: Record<TrenHarga, string> = {
  naik: "Naik",
  turun: "Turun",
  stabil: "Stabil",
};

function KomoditasCard({ item }: { item: KomoditasHargaLogin }) {
  return (
    <article className="group rounded-xl border border-stone-200 bg-white p-3.5 shadow-sm transition hover:border-tani-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span aria-hidden className="text-base leading-none">
            {item.emoji}
          </span>
          <h3 className="truncate text-[11px] font-bold text-tani-950">
            {item.name}
          </h3>
        </div>

        <TrenBadge change={item.change} />
      </div>

      <p className="mt-2.5 flex items-baseline gap-1 text-tani-950 tabular-nums">
        <span className="text-sm font-extrabold">{formatRupiah(item.price)}</span>
        <span className="text-[10px] font-medium text-stone-500">{item.unit}</span>
      </p>

      <p className="mt-1.5 flex items-center gap-1 text-[9px] text-stone-400">
        <PinIcon className="shrink-0 text-tani-600" />
        <span className="truncate">
          {item.wilayah} · {item.kategori}
        </span>
      </p>
    </article>
  );
}

export default function HargaPasarLoginClient() {
  const [query, setQuery] = useState("");
  const [provinsi, setProvinsi] = useState(OPSI_FILTER_LOGIN.provinsi[0]);
  const [kabupaten, setKabupaten] = useState(OPSI_FILTER_LOGIN.kabupaten[0]);
  const [filterKomoditas, setFilterKomoditas] = useState<string>(OPSI_PILL.komoditas[0]);
  const [filterWilayah, setFilterWilayah] = useState<string>(OPSI_PILL.wilayah[0]);
  const [filterTren, setFilterTren] = useState<string>(OPSI_PILL.tren[0]);
  const [semua, setSemua] = useState(false);

  // Reset ke 9 kartu awal setiap kali filter berubah supaya tidak menampilkan
  // halaman kosong setelah pengguna menyaring.
  const terfilter = useMemo(() => {
    const q = query.trim().toLowerCase();

    return KOMODITAS_LOGIN.filter((k) => {
      const cocokCari =
        !q ||
        k.name.toLowerCase().includes(q) ||
        k.kategori.toLowerCase().includes(q) ||
        k.wilayah.toLowerCase().includes(q);

      const cocokKabupaten =
        kabupaten === OPSI_FILTER_LOGIN.kabupaten[0] ||
        k.wilayah.toLowerCase().includes(kabupaten.toLowerCase());

      const cocokKomoditas =
        filterKomoditas === OPSI_PILL.komoditas[0] ||
        k.kategori === filterKomoditas;

      const cocokWilayah =
        filterWilayah === OPSI_PILL.wilayah[0] || k.wilayah === filterWilayah;

      const tren = trenDari(k.change);
      const cocokTren =
        filterTren === OPSI_PILL.tren[0] ||
        TREN_LABEL[tren] === filterTren;

      return (
        cocokCari && cocokKabupaten && cocokKomoditas && cocokWilayah && cocokTren
      );
    });
  }, [query, kabupaten, filterKomoditas, filterWilayah, filterTren]);

  const tampil = semua ? terfilter : terfilter.slice(0, JUMLAH_AWAL);

  function resetTampil() {
    setSemua(false);
  }

  return (
    <div className="space-y-5 pb-10">
      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-br from-[#04382a] via-[#054b36] to-[#0a7350] text-white">
        <div className="px-4 pt-8 pb-7 sm:px-6 sm:pt-10">
          <h1 className="text-2xl font-extrabold sm:text-3xl">Harga Pasar</h1>

          <p className="mt-1.5 text-[13px] text-emerald-50/75">
            Harga pasar terbaru dapat dilihat di sini
          </p>

          {/* Kartu lokasi aktif */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/10 p-3">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-lime-300/15 text-lime-300 ring-1 ring-lime-300/30"
              >
                <MarketIcon />
              </span>

              <div className="min-w-0">
                <p className="text-sm font-bold">Provinsi Lampung</p>
                <p className="text-[11px] text-emerald-50/60">Sayur Pasar</p>
              </div>
            </div>

            <span className="rounded-md bg-lime-300 px-2.5 py-1 text-[11px] font-extrabold text-tani-950">
              Terverifikasi
            </span>
          </div>

          {/* Ringkasan */}
          <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: "Komoditas", value: RINGKASAN_LOGIN.komoditas },
              { label: "Kab/Kota", value: RINGKASAN_LOGIN.pasar },
              { label: "WIB Terakhir", value: RINGKASAN_LOGIN.terakhirDiperbarui },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-white/8 px-4 py-3.5"
              >
                <dd className="text-2xl font-extrabold text-lime-300 tabular-nums">
                  {s.value}
                </dd>
                <dt className="mt-0.5 text-[11px] font-medium text-emerald-50/60">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Filter pasar & wilayah */}
      <section className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-1.5 text-xs font-extrabold text-tani-950">
            <SlidersIcon className="text-tani-600" />
            Filter Pasar &amp; Waktu
          </h2>

          <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[10px] font-medium text-stone-600">
            {TANGGAL_HARI_INI}
          </span>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <label className="relative block">
            <span className="sr-only">Cari komoditas</span>
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-stone-400">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                resetTampil();
              }}
              placeholder="Cari Komoditas (Beras, Cabai, Bawang...)"
              className="w-full rounded-lg border border-stone-200 bg-white py-2.5 pr-3 pl-9 text-xs outline-none focus:border-tani-400 focus:ring-2 focus:ring-tani-100"
            />
          </label>

          <label className="relative block">
            <span className="sr-only">Provinsi</span>
            <select
              value={provinsi}
              onChange={(e) => setProvinsi(e.target.value)}
              className="w-full appearance-none rounded-lg border border-stone-200 bg-white py-2.5 pr-8 pl-3 text-xs font-medium text-stone-700 outline-none focus:border-tani-400 focus:ring-2 focus:ring-tani-100"
            >
              {OPSI_FILTER_LOGIN.provinsi.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-stone-400">
              <ChevronDown />
            </span>
          </label>

          <label className="relative block">
            <span className="sr-only">Kabupaten/Kota</span>
            <select
              value={kabupaten}
              onChange={(e) => {
                setKabupaten(e.target.value);
                resetTampil();
              }}
              className="w-full appearance-none rounded-lg border border-stone-200 bg-white py-2.5 pr-8 pl-3 text-xs font-medium text-stone-700 outline-none focus:border-tani-400 focus:ring-2 focus:ring-tani-100"
            >
              {OPSI_FILTER_LOGIN.kabupaten.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-stone-400">
              <ChevronDown />
            </span>
          </label>
        </div>

        <button
          type="button"
          onClick={() => setSemua(true)}
          disabled={semua}
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-tani-800 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-tani-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <GridIcon />
          Tampilkan Semua Tabel
        </button>
      </section>

      {/* Judul + status sinkronisasi */}
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 className="text-sm font-extrabold text-tani-950">
          Harga Komoditas Terbaru
        </h2>

        <p className="inline-flex items-center gap-1.5 text-[10px] text-stone-500">
          <RefreshIcon className="text-tani-600" />
          <span className="font-semibold text-tani-800">Refresh Data</span>
          <span aria-hidden>·</span>
          <span className="tabular-nums">
            {RINGKASAN_LOGIN.terakhirDiperbarui} WIB
          </span>
        </p>
      </div>

      {/* Pill filter cepat: Komoditas / Wilayah / Tren */}
      <div className="flex flex-wrap gap-2">
        <label className="relative">
          <span className="sr-only">Filter komoditas</span>
          <select
            value={filterKomoditas}
            onChange={(e) => {
              setFilterKomoditas(e.target.value);
              resetTampil();
            }}
            className="appearance-none rounded-full border border-stone-200 bg-white py-1.5 pr-7 pl-3 text-[11px] font-semibold text-stone-700 outline-none hover:border-tani-300 focus:border-tani-400 focus:ring-2 focus:ring-tani-100"
          >
            {OPSI_PILL.komoditas.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-stone-400">
            <ChevronDown />
          </span>
        </label>

        <label className="relative">
          <span className="sr-only">Filter wilayah</span>
          <select
            value={filterWilayah}
            onChange={(e) => {
              setFilterWilayah(e.target.value);
              resetTampil();
            }}
            className="appearance-none rounded-full border border-stone-200 bg-white py-1.5 pr-7 pl-3 text-[11px] font-semibold text-stone-700 outline-none hover:border-tani-300 focus:border-tani-400 focus:ring-2 focus:ring-tani-100"
          >
            {OPSI_PILL.wilayah.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-stone-400">
            <ChevronDown />
          </span>
        </label>

        <label className="relative">
          <span className="sr-only">Filter tren</span>
          <select
            value={filterTren}
            onChange={(e) => {
              setFilterTren(e.target.value);
              resetTampil();
            }}
            className="appearance-none rounded-full border border-stone-200 bg-white py-1.5 pr-7 pl-3 text-[11px] font-semibold text-stone-700 outline-none hover:border-tani-300 focus:border-tani-400 focus:ring-2 focus:ring-tani-100"
          >
            {OPSI_PILL.tren.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-stone-400">
            <ChevronDown />
          </span>
        </label>

        {terfilter.length > 0 && (
          <span className="self-center text-[10px] text-stone-500 tabular-nums">
            {terfilter.length} hasil
          </span>
        )}
      </div>

      {/* Grid kartu */}
      {tampil.length > 0 ? (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {tampil.map((item) => (
            <KomoditasCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-stone-200 bg-white p-8 text-center text-xs text-stone-500">
          Komoditas &quot;{query || filterKomoditas}&quot; tidak ditemukan.
        </p>
      )}

      {/* Kotak ringkasan pasar */}
      <section className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-extrabold text-tani-950">
          {PASAR_AKTIF.kota} - {PASAR_AKTIF.nama}
        </p>

        <p className="mt-2 text-[11px] leading-relaxed text-stone-600">
          <span className="font-extrabold text-tani-950">Komoditas Utama: </span>
          {KOMODITAS_UTAMA.map(
            (k) => `${k.name} (Rp ${k.price.toLocaleString("id-ID")}${k.unit})`,
          ).join(", ")}
        </p>

        <p className="mt-2 flex flex-wrap items-center gap-x-1.5 text-[11px] font-semibold text-tani-600">
          <CheckCircleIcon className="shrink-0" />
          {KONDISI_PASAR}
          <span aria-hidden className="text-stone-300">
            |
          </span>
          <span className="font-extrabold text-tani-950">
            {terfilter.length} Pengecer Terverifikasi
          </span>
        </p>
      </section>
    </div>
  );
}
