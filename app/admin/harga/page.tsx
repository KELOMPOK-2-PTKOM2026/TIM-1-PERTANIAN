import Link from "next/link";
import ActionButton from "@/components/features/admin/ActionButton";
import { CommodityForm, MarketForm, PriceForm } from "@/components/features/admin/HargaForms";
import {
  ADMIN_ICON,
  AdminIcon,
  btnGhost,
  card,
  EmptyState,
  input,
  MockBanner,
  PageHeader,
  Pagination,
  StatCard,
} from "@/components/features/admin/ui";
import { isMockMode } from "@/lib/data";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { pageParams } from "@/modules/admin/admin.shared";
import { deleteCommodityAction, deleteMarketAction, deletePriceAction } from "@/modules/harga/harga.actions";
import {
  latestPriceMap,
  listCommoditiesWithCount,
  listMarketsWithCount,
  listPrices,
  priceStats,
} from "@/modules/harga/harga.service";

type SP = { tab?: string; commodityId?: string; marketId?: string; page?: string; per?: string };

const TABS = [
  { key: "harga", label: "Data Harga" },
  { key: "komoditas", label: "Komoditas" },
  { key: "pasar", label: "Pasar" },
];

export default async function AdminHargaPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const tab = TABS.some((t) => t.key === sp.tab) ? sp.tab! : "harga";
  const { page, per, skip } = pageParams(sp, 10);
  const mock = isMockMode();

  const [stats, commodities, markets, prices, lastPrices] = await Promise.all([
    priceStats(),
    listCommoditiesWithCount(),
    listMarketsWithCount(),
    listPrices({ commodityId: sp.commodityId, marketId: sp.marketId, skip, take: per }),
    latestPriceMap(),
  ]);

  return (
    <>
      {mock && <MockBanner />}
      <PageHeader
        title="Manajemen Harga Pasar"
        description="Input harga harian komoditas per pasar. Data langsung tampil di halaman Harga Pasar."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Komoditas" value={stats.commodities} unit="Bahan" />
        <StatCard label="Pasar terhubung" value={stats.markets} unit="Pasar" />
        <StatCard
          label="Data harga"
          value={stats.prices.toLocaleString("id-ID")}
          unit="Baris"
          note={stats.latest ? `Pembaruan terakhir ${formatTanggal(stats.latest)}` : "Belum ada data"}
        />
      </div>

      <nav className="flex gap-2">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/harga?tab=${t.key}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              tab === t.key ? "bg-[#084734] text-white" : "bg-white text-stone-700 hover:bg-stone-100"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          {tab === "harga" && (
            <>
              <form className={`${card} grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto]`}>
                <input type="hidden" name="tab" value="harga" />
                <select name="commodityId" defaultValue={sp.commodityId ?? ""} className={input}>
                  <option value="">Semua komoditas</option>
                  {commodities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <select name="marketId" defaultValue={sp.marketId ?? ""} className={input}>
                  <option value="">Semua pasar</option>
                  {markets.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <button className={btnGhost}>
                  <AdminIcon d={ADMIN_ICON.search} /> Filter
                </button>
              </form>
              {prices.items.length === 0 ? (
                <EmptyState>Belum ada data harga.</EmptyState>
              ) : (
                <div className={`${card} overflow-x-auto`}>
                  <table className="w-full text-sm">
                    <thead className="bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500">
                      <tr>
                        <th className="px-4 py-3">Tanggal</th>
                        <th className="px-4 py-3">Komoditas</th>
                        <th className="px-4 py-3">Pasar</th>
                        <th className="px-4 py-3 text-right">Harga</th>
                        {!mock && <th className="px-4 py-3" />}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {prices.items.map((p) => (
                        <tr key={p.id}>
                          <td className="whitespace-nowrap px-4 py-3">{formatTanggal(p.date)}</td>
                          <td className="px-4 py-3 font-semibold">{p.commodity}</td>
                          <td className="px-4 py-3">{p.market}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-[#084734]">
                            {formatRupiah(p.price)}/{p.unit}
                          </td>
                          {!mock && (
                            <td className="px-4 py-3 text-right">
                              <ActionButton
                                action={deletePriceAction}
                                fields={{ id: p.id }}
                                confirmText="Hapus data harga ini?"
                                className="text-red-600 hover:underline"
                              >
                                <AdminIcon d={ADMIN_ICON.trash} />
                              </ActionButton>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <Pagination
                basePath="/admin/harga"
                params={{ ...sp, tab: "harga" }}
                page={page}
                per={per}
                total={prices.total}
                noun="data harga"
              />
            </>
          )}

          {tab === "komoditas" && (
            <RefList
              rows={commodities.map((c) => ({ id: c.id, name: c.name, sub: `per ${c.unit}`, count: c.count }))}
              action={deleteCommodityAction}
              readOnly={mock}
            />
          )}
          {tab === "pasar" && (
            <RefList
              rows={markets.map((m) => ({ id: m.id, name: m.name, sub: m.city, count: m.count }))}
              action={deleteMarketAction}
              readOnly={mock}
            />
          )}
        </div>

        {!mock && (
          <aside className="lg:sticky lg:top-6">
            {tab === "harga" && <PriceForm commodities={commodities} markets={markets} lastPrices={lastPrices} />}
            {tab === "komoditas" && <CommodityForm />}
            {tab === "pasar" && <MarketForm />}
          </aside>
        )}
      </div>
    </>
  );
}

function RefList({
  rows,
  action,
  readOnly,
}: {
  rows: { id: string; name: string; sub: string; count: number }[];
  action: (formData: FormData) => Promise<void>;
  readOnly: boolean;
}) {
  if (rows.length === 0) return <EmptyState>Belum ada data.</EmptyState>;
  return (
    <ul className={`${card} divide-y divide-stone-100`}>
      {rows.map((r) => (
        <li key={r.id} className="flex items-center justify-between gap-3 px-5 py-4">
          <div>
            <p className="font-semibold">{r.name}</p>
            <p className="text-xs text-stone-500">
              {r.sub} · {r.count} data harga
            </p>
          </div>
          {!readOnly && (
            <ActionButton
              action={action}
              fields={{ id: r.id }}
              confirmText={`Hapus "${r.name}" beserta ${r.count} data harganya?`}
              className={`${btnGhost} text-red-600`}
            >
              <AdminIcon d={ADMIN_ICON.trash} className="h-3.5 w-3.5" /> Hapus
            </ActionButton>
          )}
        </li>
      ))}
    </ul>
  );
}
