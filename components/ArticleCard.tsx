import Link from "next/link";
import { CATEGORY_LABEL, type Article } from "@/lib/data";
import { formatTanggal } from "@/lib/format";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-tani-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex-1 p-4">
        <span className="inline-block rounded-full bg-tani-100 px-2.5 py-1 text-[11px] font-semibold text-tani-800">
          {CATEGORY_LABEL[article.category]}
        </span>
        <h3 className="mt-2 text-base font-bold leading-snug">
          <Link href={`/artikel/${article.slug}`} className="hover:text-tani-700">
            {article.title}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-stone-600">{article.excerpt}</p>
      </div>
      <div className="flex items-center justify-between border-t border-stone-100 px-4 py-2.5 text-xs text-stone-500">
        <span>{formatTanggal(article.publishedAt)}</span>
        <Link
          href={`/artikel/${article.slug}`}
          className="font-semibold text-tani-700 hover:underline"
        >
          Selengkapnya →
        </Link>
      </div>
    </article>
  );
}
