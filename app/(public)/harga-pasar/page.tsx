import HargaExplorer from "@/components/HargaExplorer";
import { getCommodities, getMarkets, getPrices, isMockMode } from "@/lib/data";

export const revalidate = 60;

export default async function HargaPasarPage() {
  const [commodities, markets, prices] = await Promise.all([
    getCommodities(),
    getMarkets(),
    getPrices(),
  ]);

  return (
    <div className="space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-extrabold">Harga Pasar</h1>
        <p className="mt-1 text-sm text-stone-600">
          Pantau harga komoditas per pasar sebelum menjual panen. Pilih
          komoditas dan pasar untuk melihat harga terakhir, tren 30 hari, dan
          tabel harian.
        </p>
        {isMockMode() && (
          <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-900">
            Mode contoh: data harga saat ini adalah data contoh lokal (input
            manual admin via seed). Hubungkan <code>DATABASE_URL</code> Neon
            untuk data produksi.
          </p>
        )}
      </div>
      <HargaExplorer
        commodities={commodities}
        markets={markets}
        prices={prices}
      />
    </div>
  );
}
