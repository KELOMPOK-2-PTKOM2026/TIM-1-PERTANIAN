import ArticleCard from "@/components/ArticleCard";
import ArticleSearchBar from "@/components/ArticleSearchBar";
import FeaturedArticle from "@/components/FeaturedArticle";
import HeroComponent from "@/components/HeroComponent";
import { getArticles, type ArticleCategory } from "@/lib/data";

export const revalidate = 60;

export default async function ArtikelPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const articles = await getArticles({
    q,
    category: category as ArticleCategory | undefined,
  });

  // Hitung trending tags dari semua artikel
  const tagCounts = new Map<string, number>();
  for (const a of articles) {
    for (const tag of a.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }
  const trendingTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

  const [featured, ...rest] = articles;

  return (
    <div className="space-y-4 pt-4 pb-8">
      <HeroComponent />

      {/* Search bar di atas featured article */}
      <ArticleSearchBar
        trendingTags={trendingTags}
        currentCategory={category}
        currentQuery={q}
      />

      {featured && <FeaturedArticle article={featured} />}

      {rest.length === 0 ? (
        <p className="rounded-xl bg-white p-8 text-center text-sm text-stone-500">
          Tidak ada artikel yang cocok. Coba kata kunci atau kategori lain.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(0, 6).map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
