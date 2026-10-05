import ObatCard from "@/components/ObatCard";
import ObatSearchBar from "@/components/ObatSearchBar";
import { getObats } from "@/lib/data";

export const revalidate = 60;

export default async function ObatPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const obats = await getObats();

  const filtered = obats.filter((o) => {
    const matchCategory = !category || o.category === category;
    const query = (q ?? "").toLowerCase();
    const matchQuery =
      !query ||
      o.name.toLowerCase().includes(query) ||
      o.activeIngredient.toLowerCase().includes(query) ||
      o.tanamanSasaran.some((t) => t.toLowerCase().includes(query));
    return matchCategory && matchQuery;
  });

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden bg-[#003527] p-6 text-white md:p-10">
        <div className="mx-auto max-w-6xl px-4 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">
              Info Obat & Nutrisi Tanaman
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Cari informasi obat dan penggunaannya untuk tanaman. Panduan
              takaran teruji, interval keselamatan panen, dan regulasi resmi
              perlindungan flora.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-xs text-white/90">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Database 250+ formula pestisida & nutrisi terdaftar resmi
              Kementerian Pertanian
            </div>
          </div>

          <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm md:w-72">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-white/70">
              Standarisasi Dosis
            </p>
            <h3 className="mt-1 text-lg font-bold">Proteksi Efektif</h3>
            <p className="mt-2 text-xs leading-relaxed text-white/70">
              Pencegahan resistensi patogen dengan ketepatan bahan aktif & waktu
              henti aplikasi.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-full bg-[#CDEF7A] px-3 py-1 text-[11px] font-bold text-[#084734]">
                Aman & Terukur
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <ObatSearchBar currentCategory={category} currentQuery={q} />

      {/* Daftar */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-[#084734]">
              Daftar Obat Tanaman
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Menampilkan produk perlindungan dan nutrisi pertanian
              terverifikasi Kementerian Pertanian RI
            </p>
          </div>
          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
            Menampilkan {filtered.length} Formula
          </span>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-xl bg-white p-8 text-center text-sm text-stone-500">
            Tidak ada obat yang cocok. Coba kata kunci atau kategori lain.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((o) => (
              <ObatCard key={o.id} obat={o} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
