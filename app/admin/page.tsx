import Link from "next/link";
import { Badge, card, MockBanner, PageHeader, StatCard } from "@/components/features/admin/ui";
import { isMockMode } from "@/lib/data";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { CATEGORY_LABEL } from "@/lib/mock";
import { articleStats, listArticles } from "@/modules/artikel/artikel.service";
import { listPrices, priceStats } from "@/modules/harga/harga.service";
import { pesticideCountByType } from "@/modules/obat/obat.service";

export default async function AdminOverviewPage() {
  const [art, harga, obat, latest, prices] = await Promise.all([
    articleStats(),
    priceStats(),
    pesticideCountByType(),
    listArticles({ skip: 0, take: 5 }),
    listPrices({ skip: 0, take: 6 }),
  ]);

  return (
    <>
      {isMockMode() && <MockBanner />}
      <PageHeader
        title="Dashboard"
        description="Ringkasan konten Tanimaju: artikel, harga pasar, dan katalog obat pertanian."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total artikel" value={art.total} unit="Artikel" note={`+${art.newThisMonth} bulan ini`} />
        <StatCard label="Draft" value={art.drafts} unit="Menunggu" note={`${art.published} sudah terbit`} />
        <StatCard label="Data harga" value={harga.prices} unit="Baris" note={`${harga.commodities} komoditas · ${harga.markets} pasar`} />
        <StatCard label="Info obat" value={obat.total} unit="Produk" note={`${obat.INSEKTISIDA} insektisida · ${obat.FUNGISIDA} fungisida`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={`${card} p-5`}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-[#084734]">Artikel terbaru</h2>
            <Link href="/admin/artikel" className="text-sm font-semibold text-tani-600 hover:underline">
              Semua ›
            </Link>
          </div>
          <ul className="divide-y divide-stone-100">
            {latest.items.map((a) => (
              <li key={a.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/artikel/${a.id}/edit`} className="line-clamp-1 font-semibold hover:underline">
                    {a.title}
                  </Link>
                  <p className="text-xs text-stone-500">
                    {CATEGORY_LABEL[a.category]} · {formatTanggal(a.publishedAt ?? a.createdAt)}
                  </p>
                </div>
                {a.publishedAt ? <Badge dot>Terbit</Badge> : <Badge tone="amber" dot>Draft</Badge>}
              </li>
            ))}
          </ul>
        </section>

        <section className={`${card} p-5`}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-[#084734]">Input harga terakhir</h2>
            <Link href="/admin/harga" className="text-sm font-semibold text-tani-600 hover:underline">
              Kelola ›
            </Link>
          </div>
          <ul className="divide-y divide-stone-100">
            {prices.items.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-semibold">{p.commodity}</p>
                  <p className="text-xs text-stone-500">
                    {p.market} · {formatTanggal(p.date)}
                  </p>
                </div>
                <span className="font-bold text-[#084734]">
                  {formatRupiah(p.price)}/{p.unit}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
