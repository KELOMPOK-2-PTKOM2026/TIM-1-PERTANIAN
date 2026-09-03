import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { CATEGORY_LABEL, getArticles, getPrices, type ArticleCategory } from "@/lib/data";
import { formatRupiah, formatTanggal } from "@/lib/format";

export const revalidate = 60;

const CATEGORY_CARDS: { key: ArticleCategory; icon: string; desc: string }[] = [
  {
    key: "PENGETAHUAN",
    icon: "📚",
    desc: "Perkaya wawasan dengan dasar-dasar ilmu pertanian.",
  },
  {
    key: "KIAT",
    icon: "🌱",
    desc: "Kiat dan teknis budidaya yang terbukti efektif.",
  },
  {
    key: "SOLUSI",
    icon: "🩺",
    desc: "Penyebab sekaligus solusi masalah tanaman Anda.",
  },
  {
    key: "INSPIRASI",
    icon: "✨",
    desc: "Kisah sukses petani Indonesia yang menginspirasi.",
  },
];

export default async function Home() {
  const [latest, prices] = await Promise.all([getArticles(), getPrices()]);

  // Harga terakhir per komoditas di pasar pertama (highlight)
  const highlight = (() => {
    const byCommodity = new Map<string, { price: number; date: string }>();
    for (const p of prices) {
      const cur = byCommodity.get(p.commodityId);
      if (!cur || p.date > cur.date) byCommodity.set(p.commodityId, { price: p.price, date: p.date });
    }
    return [...byCommodity.entries()].slice(0, 4);
  })();

  const { getCommodities } = await import("@/lib/data");
  const commodities = await getCommodities();
  const nameOf = (id: string) => commodities.find((c) => c.id === id)?.name ?? id;

  return (
    <div className="space-y-12 py-8">
      <section className="overflow-hidden rounded-2xl bg-tani-800 px-6 py-10 text-white md:px-12 md:py-14">
        <p className="text-sm font-semibold uppercase tracking-widest text-tani-200">
          Untuk Petani Indonesia
        </p>
        <h1 className="mt-2 max-w-2xl text-3xl font-extrabold leading-tight md:text-5xl">
          Informasi Harga, Edukasi Budidaya & Solusi Tanaman
        </h1>
        <p className="mt-3 max-w-xl text-tani-100">
          Setapak demi setapak, selangkah demi selangkah — timba pengalaman, perkaya wawasan, dan
          pantau harga pasar sebelum menjual panen.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/harga-pasar"
            className="rounded-lg bg-pasar-500 px-5 py-3 text-sm font-bold text-tani-950 hover:bg-pasar-400"
          >
            Cek Harga Pasar
          </Link>
          <Link
            href="/artikel"
            className="rounded-lg border border-white/40 px-5 py-3 text-sm font-bold hover:bg-white/10"
          >
            Baca Artikel Tani
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold">Jelajahi Topik</h2>
          <Link href="/artikel" className="text-sm font-semibold text-tani-700 hover:underline">
            Semua artikel →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_CARDS.map((c) => (
            <Link
              key={c.key}
              href={`/artikel?kategori=${c.key}`}
              className="rounded-xl border border-tani-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <span className="text-3xl" aria-hidden>
                {c.icon}
              </span>
              <p className="mt-2 font-bold">{CATEGORY_LABEL[c.key]}</p>
              <p className="mt-1 text-sm text-stone-600">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold">Harga Hari Ini</h2>
          <Link
            href="/harga-pasar"
            className="text-sm font-semibold text-tani-700 hover:underline"
          >
            Lihat tren & tabel →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {highlight.map(([commodityId, h]) => (
            <div
              key={commodityId}
              className="rounded-xl border border-tani-100 bg-white p-4 shadow-sm"
            >
              <p className="text-sm text-stone-500">{nameOf(commodityId)}</p>
              <p className="mt-1 text-xl font-extrabold text-tani-800">
                {formatRupiah(h.price)}
                <span className="text-xs font-normal text-stone-500">/kg</span>
              </p>
              <p className="mt-0.5 text-xs text-stone-500">{formatTanggal(h.date)}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold">Artikel Terbaru</h2>
          <Link href="/artikel" className="text-sm font-semibold text-tani-700 hover:underline">
            Semua artikel →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {latest.slice(0, 4).map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-tani-300 bg-tani-100/60 p-6 text-center">
        <h2 className="text-lg font-bold">Butuh konsultasi masalah tanaman?</h2>
        <p className="mx-auto mt-1 max-w-xl text-sm text-stone-600">
          Fitur Konsultasi (wajib login, via dashboard) dan Info Obat-obatan sedang disiapkan pada
          Fase 2 sesuai PLAN.MD.
        </p>
        <Link
          href="/segera-hadir?fitur=konsultasi"
          className="mt-4 inline-block rounded-lg bg-tani-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-tani-600"
        >
          Lihat Rencana Fitur
        </Link>
      </section>
    </div>
  );
}
