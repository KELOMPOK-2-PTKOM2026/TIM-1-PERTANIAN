import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import Markdown from "@/components/Markdown";
import { CATEGORY_LABEL, getArticleBySlug, getArticleSlugs, getArticles } from "@/lib/data";
import { formatTanggal } from "@/lib/format";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ArtikelDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = (await getArticles({ category: article.category })).filter(
    (a) => a.slug !== article.slug,
  ).slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-8">
      <nav className="text-xs text-stone-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">
          Beranda
        </Link>{" "}
        /{" "}
        <Link href="/artikel" className="hover:underline">
          Artikel
        </Link>{" "}
        /{" "}
        <Link href={`/artikel?kategori=${article.category}`} className="hover:underline">
          {CATEGORY_LABEL[article.category]}
        </Link>
      </nav>

      <div>
        <span className="inline-block rounded-full bg-tani-100 px-3 py-1 text-xs font-semibold text-tani-800">
          {CATEGORY_LABEL[article.category]}
        </span>
        <h1 className="mt-3 text-2xl font-extrabold leading-tight md:text-3xl">
          {article.title}
        </h1>
        <p className="mt-2 text-xs text-stone-500">
          {formatTanggal(article.publishedAt)} · {article.views} dibaca
        </p>
      </div>

      <div className="rounded-xl border border-tani-100 bg-white p-5 shadow-sm md:p-8">
        <Markdown text={article.contentMd} />
        <div className="mt-6 flex flex-wrap gap-2 border-t border-stone-100 pt-4">
          {article.tags.map((t) => (
            <Link
              key={t}
              href={`/artikel?q=${encodeURIComponent(t.replace(/^#/, ""))}`}
              className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600 hover:bg-tani-100"
            >
              {t}
            </Link>
          ))}
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold">Artikel Terkait</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
