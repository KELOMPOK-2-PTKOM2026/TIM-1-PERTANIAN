import Link from "next/link";
import { CATEGORY_LABEL, type Article } from "@/lib/data";
import { formatTanggal } from "@/lib/format";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="relative flex w-full flex-col overflow-hidden rounded-2xl bg-[#084734] shadow-[0px_4px_18px_0px_rgba(19,78,74,0.90)] transition hover:shadow-[0px_6px_24px_0px_rgba(19,78,74,0.90)]">
      {/* 1. Kurangi tinggi gambar dari h-48 (192px) menjadi h-36 (144px) */}
      <div className="absolute inset-x-0 top-0 h-36 opacity-90 rounded-b-2xl overflow-hidden z-0">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* 2. Badges Section */}
      <div className="absolute left-3 top-3 flex gap-1.5 z-10">
        <span className="rounded-md bg-white px-2.5 py-1 text-[11px] font-bold leading-[14px] tracking-wide text-[#006e2f]">
          {CATEGORY_LABEL[article.category]}
        </span>
        <span className="rounded-md bg-[#6d3800] px-2 py-1 text-[11px] font-bold leading-[14px] tracking-wide text-[#ff9c42]">
          Populer
        </span>
      </div>

      {/* 3. Content Section */}
      {/* Sesuaikan pt-48 menjadi pt-36 agar sejajar dengan tinggi gambar yang baru */}
      <div className="relative flex-1 p-4 pt-36 flex flex-col z-10 text-white">
        <div className="flex flex-col gap-1 mb-3">
          <span className="text-[11px] font-medium leading-[14px] tracking-wide text-white/70">
            {formatTanggal(article.publishedAt)}
          </span>

          <h3 className="line-clamp-2 text-base font-bold leading-5 text-white">
            <Link href={`/artikel/${article.slug}`}>{article.title}</Link>
          </h3>

          {/* Batasi ringkasan teks dari line-clamp-3 menjadi line-clamp-2 */}
          <p className="line-clamp-2 text-[12px] leading-4 text-white/70">
            {article.excerpt}
          </p>
        </div>

        {/* Bagian Penulis & Selengkapnya */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-[17px] w-[17px] items-center justify-center rounded-full bg-white/20 text-[10px] font-bold text-white border border-white/20">
              {article.author.charAt(0)}
            </div>
            <span className="text-[11px] font-semibold leading-[14px] tracking-wide text-white">
              {article.author}
            </span>
          </div>
          <Link
            href={`/artikel/${article.slug}`}
            className="text-[11px] font-bold leading-[14px] tracking-wide text-white hover:underline"
          >
            Selengkapnya
          </Link>
        </div>
      </div>
    </article>
  );
}
