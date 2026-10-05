import type { Metadata } from "next";

import HargaPasarLoginClient from "@/components/HargaPasarLoginClient";

export const metadata: Metadata = {
  title: "Harga Pasar — TaniMaju",
  description:
    "Pantau harga komoditas terbaru di pasar. Masuk untuk melihat tren 30 hari dan simpan pantauan harga.",
};

// Varian halaman harga pasar untuk pengunjung yang belum login.
// TODO Fase 2: setelah Auth.js v5 siap, tombol "Login | Daftar" dan "Masuk"
// di navbar diarahkan ke /login, dan section "Masuk untuk melihat tren 30
// hari" disembunyikan untuk sesi yang sudah login.
export default function HargaPasarLoginPage() {
  return (
    <div className="px-4 py-5">
      <HargaPasarLoginClient />
    </div>
  );
}
