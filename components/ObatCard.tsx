import type { Obat } from "@/lib/data";

export default function ObatCard({ obat }: { obat: Obat }) {
  return (
    <article className="flex w-full flex-col rounded-2xl border border-stone-100 bg-white p-5 shadow-[0_4px_18px_0_rgba(19,78,74,0.10)]">
      {/* Header: Kategori & Harga */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-lg font-extrabold text-[#084734]">{obat.name}</p>
          <p className="text-xs text-[#2b9f4e]">{obat.activeIngredient}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-stone-400">Harga eceran</p>
          <p className="text-lg font-extrabold text-[#084734]">
            Rp {obat.price.toLocaleString("id-ID")}
          </p>
          <p className="text-[11px] text-stone-400">/ {obat.unit}</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-4 rounded-xl bg-[#CDEDB3]/40 p-4">
        <div className="flex gap-3">
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-stone-500">
                Kegunaan Sasaran
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#404847]">
                {obat.kegunaanSasaran}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-stone-500">
                Tanaman Sasaran
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {obat.tanamanSasaran.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-[#e8f5e0] px-2 py-0.5 text-[11px] font-medium text-[#2b6124]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-stone-500">
                Dosis & Aplikasi
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#404847]">
                {obat.dosisAplikasi}
              </p>
            </div>
          </div>

          <img
            src={obat.imageUrl}
            alt={obat.activeIngredient}
            className="h-20 w-20 shrink-0 rounded-lg object-cover"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-[#084734]">
          <svg
            className="h-4 w-4 text-[#2b9f4e]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          PHI: {obat.phi}
        </div>
        <a
          href={`/obat/${obat.id}`}
          className="rounded-lg bg-[#CDEF7A] px-4 py-2 text-xs font-bold text-[#084734] shadow-sm transition hover:bg-[#c2e8af]"
        >
          Lihat Detail →
        </a>
      </div>
    </article>
  );
}
