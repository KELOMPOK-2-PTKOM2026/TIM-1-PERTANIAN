import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { MOCK_COMMODITIES, MOCK_MARKETS, MOCK_PRICES } from "@/lib/mock";
import { requireDb } from "@/modules/admin/admin.shared";
import type { CommodityInput, MarketInput, PriceInput } from "./harga.schema";

export type AdminPrice = {
  id: string;
  commodity: string;
  unit: string;
  market: string;
  price: number;
  date: string; // yyyy-mm-dd
};

export type AdminPriceFilter = { commodityId?: string; marketId?: string; skip: number; take: number };

export async function listPrices(f: AdminPriceFilter) {
  if (!prisma) {
    const all = MOCK_PRICES.filter(
      (p) => (!f.commodityId || p.commodityId === f.commodityId) && (!f.marketId || p.marketId === f.marketId),
    ).sort((a, b) => b.date.localeCompare(a.date));
    const items = all.slice(f.skip, f.skip + f.take).map((p, i) => {
      const c = MOCK_COMMODITIES.find((x) => x.id === p.commodityId);
      return {
        id: `mock-${f.skip + i}`,
        commodity: c?.name ?? "-",
        unit: c?.unit ?? "kg",
        market: MOCK_MARKETS.find((x) => x.id === p.marketId)?.name ?? "-",
        price: p.price,
        date: p.date,
      };
    });
    return { items, total: all.length };
  }
  const where: Prisma.PriceWhereInput = {
    ...(f.commodityId ? { commodityId: f.commodityId } : {}),
    ...(f.marketId ? { marketId: f.marketId } : {}),
  };
  const [rows, total] = await Promise.all([
    prisma.price.findMany({
      where,
      include: { commodity: true, market: true },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      skip: f.skip,
      take: f.take,
    }),
    prisma.price.count({ where }),
  ]);
  const items: AdminPrice[] = rows.map((r) => ({
    id: r.id,
    commodity: r.commodity.name,
    unit: r.commodity.unit,
    market: r.market.name,
    price: r.price,
    date: r.date.toISOString().slice(0, 10),
  }));
  return { items, total };
}

export type LastPrice = { price: number; date: string };

// Harga terakhir per pasangan komoditas+pasar, key "commodityId:marketId".
// Dipakai form input agar admin bisa membandingkan dengan harga sebelumnya.
export async function latestPriceMap(): Promise<Record<string, LastPrice>> {
  const map: Record<string, LastPrice> = {};
  if (!prisma) {
    for (const p of MOCK_PRICES) {
      const key = `${p.commodityId}:${p.marketId}`;
      if (!map[key] || p.date > map[key].date) map[key] = { price: p.price, date: p.date };
    }
    return map;
  }
  const rows = await prisma.price.findMany({
    distinct: ["commodityId", "marketId"],
    orderBy: [{ commodityId: "asc" }, { marketId: "asc" }, { date: "desc" }, { createdAt: "desc" }],
    select: { commodityId: true, marketId: true, price: true, date: true },
  });
  for (const r of rows) {
    map[`${r.commodityId}:${r.marketId}`] = { price: r.price, date: r.date.toISOString().slice(0, 10) };
  }
  return map;
}

export async function priceStats() {
  if (!prisma) {
    const latest = MOCK_PRICES.reduce((m, p) => (p.date > m ? p.date : m), "");
    return {
      commodities: MOCK_COMMODITIES.length,
      markets: MOCK_MARKETS.length,
      prices: MOCK_PRICES.length,
      latest: latest || null,
    };
  }
  const [commodities, markets, prices, last] = await Promise.all([
    prisma.commodity.count(),
    prisma.market.count(),
    prisma.price.count(),
    prisma.price.findFirst({ orderBy: { date: "desc" }, select: { date: true } }),
  ]);
  return { commodities, markets, prices, latest: last?.date.toISOString().slice(0, 10) ?? null };
}

// Komoditas + jumlah data harga (untuk tab kelola).
export async function listCommoditiesWithCount() {
  if (!prisma)
    return MOCK_COMMODITIES.map((c) => ({
      ...c,
      count: MOCK_PRICES.filter((p) => p.commodityId === c.id).length,
    }));
  const rows = await prisma.commodity.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { prices: true } } },
  });
  return rows.map((r) => ({ id: r.id, name: r.name, unit: r.unit, count: r._count.prices }));
}

export async function listMarketsWithCount() {
  if (!prisma)
    return MOCK_MARKETS.map((m) => ({ ...m, count: MOCK_PRICES.filter((p) => p.marketId === m.id).length }));
  const rows = await prisma.market.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { prices: true } } },
  });
  return rows.map((r) => ({ id: r.id, name: r.name, city: r.city, count: r._count.prices }));
}

export async function createPrice(input: PriceInput) {
  return requireDb().price.create({ data: { ...input, date: new Date(input.date) } });
}

export async function deletePrice(id: string) {
  return requireDb().price.delete({ where: { id } });
}

export async function createCommodity(input: CommodityInput) {
  return requireDb().commodity.create({ data: input });
}

export async function deleteCommodity(id: string) {
  return requireDb().commodity.delete({ where: { id } });
}

export async function createMarket(input: MarketInput) {
  return requireDb().market.create({ data: input });
}

export async function deleteMarket(id: string) {
  return requireDb().market.delete({ where: { id } });
}
