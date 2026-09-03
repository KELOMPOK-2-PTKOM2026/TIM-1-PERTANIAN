import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { CATEGORY_LABEL, getArticles, type ArticleCategory } from "@/lib/data";

export const revalidate = 60;

const CATEGORIES: ("SEMUA" | ArticleCategory)[] = [
  "SEMUA",
  "PENGETAHUAN",
  "KIAT",
  "SOLUSI",
  "INSPIRASI",
];

export default async function ArtikelPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; q?: string }>;
}) {
  const params = await searchParams;
  const kategori = (params.kategori as ArticleCategory | "SEMUA" | undefined) ?? "SEMUA";
  const q = params.q ?? "";
  const validKategori =
    kategori === "SEMUA" || (Object.keys(CATEGORY_LABEL) as string[]).includes(kategori)
      ? kategori
      : "SEMUA";

  const articles = await getArticles({
    category: validKategori === "SEMUA" ? undefined : (validKategori as ArticleCategory),
    q,
  });

  return (
    <div className="space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-extrabold">Artikel & Edukasi</h1>
        <p className="mt-1 text-sm text-stone-600">
          Tips budidaya, pengetahuan dasar, solusi masalah tanaman, dan kisah inspiratif.
        </p>
      </div>

      <form method="get" action="/artikel" className="flex gap-2">
        <input type="hidden" name="kategori" value={validKategori} />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Cari: thrips, pupuk, bedengan…"
          className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-tani-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-tani-600"
        >
          Cari
        </button>
      </form>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter kategori">
        {CATEGORIES.map((c) => {
          const href = c === "SEMUA" ? "/artikel" : `/artikel?kategori=${c}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
          const activeState = validKategori === c;
          return (
            <Link
              key={c}
              href={href}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                activeState
                  ? "bg-tani-700 text-white"
                  : "border border-tani-200 bg-white text-tani-800 hover:bg-tani-50"
              }`}
            >
              {c === "SEMUA" ? "Semua" : CATEGORY_LABEL[c]}
            </Link>
          );
        })}
      </div>

      {articles.length === 0 ? (
        <p className="rounded-xl bg-white p-8 text-center text-sm text-stone-500">
          Tidak ada artikel yang cocok. Coba kata kunci atau kategori lain.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
