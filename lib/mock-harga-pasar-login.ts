// Data mock untuk halaman /harga-pasar-login (varian "belum login").
//
// BEDA dengan lib/mock-harga-pasar.ts: file itu untuk kartu consumer di
// /harga-pasar yang aktif. Halaman ini memakai filter berbentuk pill
// (Komoditas / Wilayah / Tren) + kotak "Tampilkan Semua Tabel", jadi butuh
// field kategori, wilayah, dan tren per baris. Sengaja dipisah supaya
// perubahan di sini tidak mengubah /harga-pasar.
//
// TODO Fase 2: ganti dengan query prisma (Price terbaru per Komoditas di
// Market terpilih) supaya angka ikut berubah saat admin input harga baru.

export type TrenHarga = "naik" | "turun" | "stabil";

export type KomoditasHargaLogin = {
  id: string;
  name: string;
  emoji: string;
  price: number;
  unit: string;
  change: number; // persen signed, 0 = stabil
  kategori: string;
  wilayah: string;
};

// Lokasi aktif + ringkasan di hero
export const PASAR_AKTIF = {
  nama: "Pasar Bandar Jaya",
  kota: "Lampung Tengah",
};

export const RINGKASAN_LOGIN = {
  komoditas: 84,
  pasar: 15,
  terakhirDiperbarui: "20:35",
};

// Tanggal hari ini supaya baris "Filter Pasar & Wilayah" tidak hardcode.
export const TANGGAL_HARI_INI = new Date().toLocaleDateString("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const OPSI_FILTER_LOGIN = {
  provinsi: ["Lampung", "Jawa Barat", "Jawa Tengah", "Jawa Timur"],
  kabupaten: [
    "Semua Kabupaten/Kota",
    "Lampung Tengah",
    "Lampung Selatan",
    "Lampung Barat",
    "Lampung Timur",
    "Lampung Utara",
  ],
};

// Opsi untuk tiga pill filter di atas grid.
export const OPSI_PILL = {
  komoditas: [
    "Semua Komoditas",
    "Beras",
    "Sayur",
    "Palawija",
    "Gula",
    "Kopi",
  ],
  wilayah: [
    "Semua Wilayah",
    "Pasar Bandar Jaya",
    "Pasar Kiblang",
    "Pasar Pagar Alam",
    "Pasar Pringsewu",
  ],
  tren: ["Semua Tren", "Naik", "Turun", "Stabil"],
} as const;

export const KOMODITAS_LOGIN: KomoditasHargaLogin[] = [
  {
    id: "kl1",
    name: "Beras Medium",
    emoji: "🌾",
    price: 17500,
    unit: "/kg",
    change: 2.8,
    kategori: "Beras",
    wilayah: "Pasar Bandar Jaya",
  },
  {
    id: "kl2",
    name: "Cabai Besar Merah",
    emoji: "🌶️",
    price: 58000,
    unit: "/kg",
    change: 8.5,
    kategori: "Sayur",
    wilayah: "Pasar Kiblang",
  },
  {
    id: "kl3",
    name: "Bawang Merah",
    emoji: "🧅",
    price: 22000,
    unit: "/kg",
    change: 5,
    kategori: "Sayur",
    wilayah: "Pasar Pagar Alam",
  },
  {
    id: "kl4",
    name: "Bawang Putih Merah",
    emoji: "🧄",
    price: 41000,
    unit: "/kg",
    change: 6.3,
    kategori: "Sayur",
    wilayah: "Pasar Bandar Jaya",
  },
  {
    id: "kl5",
    name: "Jagung Pipil Kering",
    emoji: "🌽",
    price: 4500,
    unit: "/kg",
    change: 0,
    kategori: "Palawija",
    wilayah: "Pasar Pringsewu",
  },
  {
    id: "kl6",
    name: "Kentang",
    emoji: "🥔",
    price: 19500,
    unit: "/kg",
    change: 2.4,
    kategori: "Sayur",
    wilayah: "Pasar Bandar Jaya",
  },
  {
    id: "kl7",
    name: "Tomat",
    emoji: "🍅",
    price: 11000,
    unit: "/kg",
    change: 5.3,
    kategori: "Sayur",
    wilayah: "Pasar Kiblang",
  },
  {
    id: "kl8",
    name: "Tomat Segar",
    emoji: "🍅",
    price: 31000,
    unit: "/kg",
    change: 2.6,
    kategori: "Sayur",
    wilayah: "Pasar Pagar Alam",
  },
  {
    id: "kl9",
    name: "Gula Pasir Mentah",
    emoji: "🍬",
    price: 16000,
    unit: "/kg",
    change: 1.8,
    kategori: "Gula",
    wilayah: "Pasar Pringsewu",
  },
  // Di bawah ini belum tampil sampai pengguna menekan "Tampilkan Semua Tabel".
  {
    id: "kl10",
    name: "Keladi Lokal",
    emoji: "🍠",
    price: 13500,
    unit: "/kg",
    change: -3.2,
    kategori: "Palawija",
    wilayah: "Pasar Pagar Alam",
  },
  {
    id: "kl11",
    name: "Biji Kopi Arabika",
    emoji: "☕",
    price: 105000,
    unit: "/kg",
    change: 4.1,
    kategori: "Kopi",
    wilayah: "Pasar Pringsewu",
  },
  {
    id: "kl12",
    name: "Cabai Rawit Merah",
    emoji: "🌶️",
    price: 32500,
    unit: "/kg",
    change: -1.4,
    kategori: "Sayur",
    wilayah: "Pasar Bandar Jaya",
  },
];

// Jumlah kartu yang tampil sebelum pengguna menekan "Tampilkan Semua Tabel".
export const JUMLAH_AWAL = 9;

// Tiga komoditas yang disebut di baris "Komoditas Utama" pada kotak
// ringkasan. Nilainya sengaja terpisah dari KOMODITAS_LOGIN supaya ringkasan
// tetap punya isi walau grid sedang disaring.
// TODO Fase 2: ambil 3 komoditas terlaris dari query prisma.
export const KOMODITAS_UTAMA = [
  { name: "Bawang Merah", price: 38000, unit: "/kg" },
  { name: "Jagung Kering Pipih", price: 6500, unit: "/kg" },
  { name: "Beras Medium", price: 14500, unit: "/kg" },
];

// Label kondisi pasar di baris hijau kotak ringkasan.
export const KONDISI_PASAR = "Melimpah & Lancar";

export function trenDari(change: number): TrenHarga {
  if (change === 0) return "stabil";
  return change > 0 ? "naik" : "turun";
}
