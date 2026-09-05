import Link from "next/link";

const FITUR: Record<string, { title: string; desc: string; fase: string }> = {
  konsultasi: {
    title: "Konsultasi Tani",
    desc: "Tanya-jawab seputar budidaya, hama-penyakit, pestisida, dan pemupukan langsung dengan tim pakar. Fitur ini hanya tersedia di dashboard setelah login, bukan di halaman publik.",
    fase: "Fase 2 — dashboard + wajib login (Auth).",
  },
  // Catatan: kunci obat* pindah ke route /obat (stub Fase 2).
  // Segera-hadir hanya untuk konsultasi|login|admin + fallback generik.
  login: {
    title: "Login",
    desc: "Login dan pendaftaran akun (Petani, Pakar, Admin) untuk mengakses Konsultasi dan halaman Admin.",
    fase: "Fase 2 — modul Auth (lihat PLAN.MD).",
  },
  admin: {
    title: "Halaman Admin",
    desc: "Kelola data harga pasar, artikel, dan obat-obatan secara manual. Terproteksi khusus peran Admin.",
    fase: "Fase 2 — memerlukan Auth + guard ADMIN.",
  },
};

export default async function SegeraHadir({
  searchParams,
}: {
  searchParams: Promise<{ fitur?: string }>;
}) {
  const { fitur } = await searchParams;
  const info = FITUR[fitur ?? ""] ?? {
    title: "Fitur Ini",
    desc: "Fitur yang Anda tuju sedang disiapkan pada tahap berikutnya sesuai PLAN.MD.",
    fase: "Fase 2.",
  };

  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
        SEGERA HADIR · FASE 2
      </span>
      <h1 className="mt-4 text-3xl font-extrabold">{info.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-stone-600">{info.desc}</p>
      <p className="mt-2 text-xs font-semibold text-tani-700">{info.fase}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/artikel"
          className="rounded-lg bg-tani-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-tani-600"
        >
          Baca Artikel Tani
        </Link>
        <Link
          href="/harga-pasar"
          className="rounded-lg border border-tani-300 bg-white px-5 py-2.5 text-sm font-bold text-tani-800 hover:bg-tani-50"
        >
          Cek Harga Pasar
        </Link>
        <Link href="/" className="w-full text-center text-sm text-stone-500 hover:underline">
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
