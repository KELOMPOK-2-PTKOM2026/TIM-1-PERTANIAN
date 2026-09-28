import { prisma } from "@/lib/db";
import { getCommodities, getMarkets, getPrices } from "@/lib/data";
import { AppError } from "@/lib/errors";
import type { HargaQuery, HargaPoint } from "./harga.types";
import type { HargaUpsertInput } from "./harga.schema";

const MAX_ROWS = 2000;

// Cari id komoditas/pasar dari query yang bisa berupa id ATAU nama.
async function resolveIds(filter: HargaQuery): Promise<{ commodityId?: string; marketId?: string }> {
  const [commodities, markets] = await Promise.all([getCommodities(), getMarkets()]);
  const norm = (s: string) => s.trim().toLowerCase();

  let commodityId: string | undefined;
  if (filter.komoditas) {
    const q = norm(filter.komoditas);
    commodityId = commodities.find((c) => c.id === filter.komoditas || c.name.toLowerCase() === q)?.id;
    if (!commodityId) throw new AppError("Komoditas tidak ditemukan", "NOT_FOUND");
  }

  let marketId: string | undefined;
  if (filter.pasar) {
    const q = norm(filter.pasar);
    marketId = markets.find((m) => m.id === filter.pasar || m.name.toLowerCase() === q)?.id;
    if (!marketId) throw new AppError("Pasar tidak ditemukan", "NOT_FOUND");
  }

  return { commodityId, marketId };
}

// Ambil harga + perkaya dengan nama komoditas/pasar. Jatuh ke mock bila tanpa DB.
export async function getHarga(filter: HargaQuery = {}): Promise<HargaPoint[]> {
  const { commodityId, marketId } = await resolveIds(filter);
  const [points, commodities, markets] = await Promise.all([
    getPrices({ commodityId, marketId, from: filter.from, to: filter.to }),
    getCommodities(),
    getMarkets(),
  ]);

  const cMap = new Map(commodities.map((c) => [c.id, c]));
  const mMap = new Map(markets.map((m) => [m.id, m]));

  return points.slice(0, MAX_ROWS).map((p) => ({
    date: p.date,
    price: p.price,
    commodityId: p.commodityId,
    marketId: p.marketId,
    commodity: cMap.get(p.commodityId)?.name ?? p.commodityId,
    market: mMap.get(p.marketId)?.name ?? p.marketId,
    unit: cMap.get(p.commodityId)?.unit ?? "kg",
  }));
}

// Tulis harga harian (admin). Butuh DB; tanpa DATABASE_URL lempar DB_UNAVAILABLE.
export async function upsertHarga(input: HargaUpsertInput) {
  if (!prisma) throw new AppError("Database tidak tersedia", "DB_UNAVAILABLE");
  const date = new Date(input.date + "T00:00:00");
  const existing = await prisma.price.findFirst({
    where: { commodityId: input.commodityId, marketId: input.marketId, date },
  });
  if (existing) {
    return prisma.price.update({ where: { id: existing.id }, data: { price: input.price } });
  }
  return prisma.price.create({
    data: { commodityId: input.commodityId, marketId: input.marketId, price: input.price, date },
  });
}
