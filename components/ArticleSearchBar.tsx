"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORY_LABEL, type ArticleCategory } from "@/lib/data";

type Props = {
  trendingTags: string[];
  currentCategory?: string;
  currentQuery?: string;
};

export default function ArticleSearchBar({
  trendingTags,
  currentCategory,
  currentQuery,
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(currentQuery ?? "");

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    router.push(`/artikel?q=${encodeURIComponent(tag)}`);
  };

  const handleCategoryClick = (category?: string) => {
    if (category) {
      router.push(`/artikel?category=${category}`);
    } else {
      router.push("/artikel");
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Container Utama Berwarna Hijau (Search Bar + Trending Tags) */}
      <div className="w-full rounded-2xl bg-[#084734] p-2.5 space-y-3">
        {/* Search Bar Form */}
        <form action="/artikel" method="GET" className="w-full">
          <div className="relative flex w-full items-center gap-2 rounded-xl bg-white p-1.5 pl-4">
            <svg
              className="h-5 w-5 shrink-0 text-[#707977]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari topik tentang agrikultur..."
              className="w-full text-sm text-[#111C2D] outline-none placeholder:text-[#707977]"
            />
            <button
              type="submit"
              className="flex shrink-0 items-center gap-2 rounded-lg bg-[#D2EFC2] px-3.5 py-1.5 text-xs font-semibold text-[#0B3829] shadow-sm transition hover:bg-[#c2e8af] active:scale-95"
            >
              <div className="flex flex-col text-center leading-tight">
                <span>Cari</span>
                <span>Artikel</span>
              </div>
              <svg
                className="h-4 w-4 shrink-0 text-[#0B3829]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </form>

        {/* Trending Tags (Menyatu di dalam Container Hijau) */}
        {trendingTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 px-1 pb-1">
            <span className="text-xs font-semibold text-white/80">
              Tren Riset:
            </span>
            {trendingTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="rounded-full bg-[#ffffff] px-3 py-1 text-xs font-medium text-[#404847] backdrop-blur-sm transition hover:bg-[#084734] hover:text-[#ffffff]"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Pills (Di Luar Container Hijau) */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryClick()}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            !currentCategory
              ? "bg-[#084734] text-white"
              : "bg-[#F2F3FF] text-[#404847] hover:bg-[#E2E7FF]"
          }`}
        >
          Semua
        </button>
        {(Object.entries(CATEGORY_LABEL) as [ArticleCategory, string][]).map(
          ([key, label]) => (
            <button
              key={key}
              onClick={() => handleCategoryClick(key)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                currentCategory === key
                  ? "bg-[#084734] text-white"
                  : "bg-[#F2F3FF] text-[#404847] hover:bg-[#E2E7FF]"
              }`}
            >
              {label}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
