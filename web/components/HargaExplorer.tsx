"use client";

import { useMemo, useState } from "react";
import TrendChart from "./TrendChart";
import type { Commodity, Market, PricePoint } from "@/lib/data";
import { formatRupiah, formatTanggal } from "@/lib/format";

export default function HargaExplorer({
  commodities,
  markets,
  prices,
}: {
  commodities: Commodity[];
  markets: Market[];
  prices: PricePoint[];
}) {
  const [commodityId, setCommodityId] = useState(commodities[0]?.id ?? "");
  const [marketId, setMarketId] = useState(markets[0]?.id ?? "");

  const filtered = useMemo(
    () =>
      prices
        .filter((p) => p.commodityId === commodityId && p.marketId === marketId)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [prices, commodityId, marketId],
  );

  const last = filtered[filtered.length - 1];
  const prev = filtered[filtered.length - 2];
  const diff = last && prev ? last.price - prev.price : 0;

  const commodity = commodities.find((c) => c.id === commodityId);
  const market = markets.find((m) => m.id === marketId);
  const tableRows = [...filtered].reverse().slice(0, 14);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-xl border border-tani-100 bg-white p-4 shadow-sm md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Komoditas</span>
          <select
            value={commodityId}
            onChange={(e) => setCommodityId(e.target.value)}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm"
          >
            {commodities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (per {c.unit})
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Pasar</span>
          <select
            value={marketId}
            onChange={(e) => setMarketId(e.target.value)}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm"
          >
            {markets.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.city}
              </option>
            ))}
          </select>
        </label>
      </div>

      {last && commodity && market ? (
        <div className="rounded-xl bg-tani-800 p-5 text-white shadow">
          <p className="text-sm text-tani-100">
            Harga terakhir {commodity.name} di {market.name}
          </p>
          <p className="mt-1 text-3xl font-bold">
            {formatRupiah(last.price)}
            <span className="text-base font-normal text-tani-200">/{commodity.unit}</span>
          </p>
          <p className="mt-1 text-sm text-tani-100">
            {formatTanggal(last.date)}
            {prev && (
              <span
                className={`ml-2 font-semibold ${diff >= 0 ? "text-pasar-400" : "text-red-300"}`}
              >
                {diff >= 0 ? "▲" : "▼"} {formatRupiah(Math.abs(diff))} vs sehari sebelumnya
              </span>
            )}
          </p>
        </div>
      ) : (
        <p className="rounded-xl bg-white p-6 text-center text-sm text-stone-500">
          Tidak ada data untuk kombinasi ini.
        </p>
      )}

      <section className="rounded-xl border border-tani-100 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-base font-bold">Tren 30 Hari Terakhir</h2>
        <TrendChart
          data={filtered.map((p) => ({
            date: p.date,
            label: formatTanggal(p.date),
            price: p.price,
          }))}
        />
      </section>

      <section className="overflow-hidden rounded-xl border border-tani-100 bg-white shadow-sm">
        <h2 className="border-b border-stone-100 p-4 text-base font-bold">
          Tabel Harga (14 hari terakhir)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-105 text-left text-sm">
            <thead className="bg-tani-50 text-tani-900">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Tanggal</th>
                <th className="px-4 py-2.5 font-semibold">Harga</th>
                <th className="px-4 py-2.5 font-semibold">Perubahan</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((r, i) => {
                const d = i + 1 < tableRows.length ? r.price - tableRows[i + 1].price : 0;
                return (
                  <tr key={r.date} className="border-t border-stone-100">
                    <td className="px-4 py-2.5">{formatTanggal(r.date)}</td>
                    <td className="px-4 py-2.5 font-semibold">{formatRupiah(r.price)}</td>
                    <td className={`px-4 py-2.5 ${d >= 0 ? "text-tani-700" : "text-red-600"}`}>
                      {i + 1 < tableRows.length
                        ? `${d >= 0 ? "+" : "−"}${formatRupiah(Math.abs(d)).slice(2)}`
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
