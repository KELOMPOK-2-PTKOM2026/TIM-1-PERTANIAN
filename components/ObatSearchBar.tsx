"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORY_OBAT_LABEL } from "@/lib/data";

type Props = {
  currentCategory?: string;
  currentQuery?: string;
};

export default function ObatSearchBar({ currentCategory, currentQuery }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(currentQuery ?? "");

  const handleCategoryClick = (category?: string) => {
    if (category) {
      router.push(`/obat?category=${category}`);
    } else {
      router.push("/obat");
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-[0_4px_18px_0_rgba(19,78,74,0.10)]">
        <h2 className="text-xl font-extrabold text-[#084734]">
          Cari Obat Tanaman
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Ketik bahan aktif, merek dagang, atau komoditas tanaman sasaran
        </p>

        <form action="/obat" method="GET" className="mt-4">
          {currentCategory && (
            <input type="hidden" name="category" value={currentCategory} />
          )}
          <div className="flex w-full items-center gap-2 rounded-xl border border-stone-200 bg-[#F2F3FF]/50 p-2 pl-4">
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
              placeholder="Cari nama obat, bahan aktif, atau jenis tanaman (misal: Antracol, Cabai)..."
              className="w-full bg-transparent text-sm text-[#111C2D] outline-none placeholder:text-[#707977]"
            />
            <button
              type="submit"
              className="flex shrink-0 items-center gap-2 rounded-lg bg-[#CDEF7A] px-5 py-2.5 text-sm font-bold text-[#084734] shadow-sm transition hover:bg-[#c2e8af] active:scale-95"
            >
              Cari →
            </button>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-[#084734]">
            Kategori Populer:
          </span>
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
          {Object.entries(CATEGORY_OBAT_LABEL).map(([key, label]) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
