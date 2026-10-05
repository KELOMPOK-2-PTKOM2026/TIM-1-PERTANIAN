import Link from "next/link";
import { CATEGORY_LABEL, type Article } from "@/lib/data";
import { formatTanggal } from "@/lib/format";

export default function FeaturedArticle({ article }: { article: Article }) {
  return (
    <section className="mx-auto min-h-[160px] w-full max-w-7xl overflow-hidden rounded-2xl bg-[rgba(107,255,143,0.38)] shadow-[0_8px_30px_0_rgba(19,78,74,0.90)]">
      <div className="flex min-h-[160px] flex-col bg-[#084734] md:flex-row">
        {/* Image */}
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80"
            alt={article.title}
            className="h-48 w-full object-cover md:h-full"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center p-4 text-white md:w-1/2 md:p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#E2E7FF] px-3 py-1 text-xs font-semibold text-tani-800">
              {CATEGORY_LABEL[article.category]}
            </span>
            <span className="text-xs text-[#707977]">
              {formatTanggal(article.publishedAt)}
            </span>
          </div>

          <h2 className="mt-3 text-2xl font-extrabold leading-tight">
            {article.title}
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-[#ffffff]">
            {article.excerpt}
          </p>

          {/* Stats */}
          <div className="mt-4 flex gap-4">
            <div className="w-1/2 rounded-lg bg-[#F2F3FF] px-4 py-3">
              <p className="text-lg text-[#006E2F] font-extrabold">+28%</p>
              <p className="text-xs text-[#404847]">Hasil Panen</p>
            </div>
            <div className="w-1/2 rounded-lg bg-[#F2F3FF] px-4 py-3">
              <p className="text-lg text-[#006E2F] font-extrabold">-30%</p>
              <p className="text-xs text-[#404847]">Penggunaan Air</p>
            </div>
          </div>

          {/* Author */}
          <div className="mt-8 bg-[#ffffff] rounded-lg flex items-center gap-3 p-6">
            <div className="h-10 w-10 rounded-full bg-tani-200" />
            <div>
              <p className="text-sm text-[#131B2E] font-semibold">
                Ahmad Fauzi, SP
              </p>
              <p className="text-xs text-tani-200">Agronom</p>
            </div>
          </div>

          {/* Link */}
          <Link
            href={`/artikel/${article.slug}`}
            className="inline-flex rounded-lg p-6 items-center justify-center gap-2 text-sm font-semibold text-[#002109] bg-[#CDEDB3] hover:text-white"
          >
            Baca Artikel Lengkap →
          </Link>
        </div>
      </div>
    </section>
  );
}
