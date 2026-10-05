import type { Pesticide, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireDb, slugify } from "@/modules/admin/admin.shared";
import type { PesticideInput, PesticideType } from "./obat.schema";

export type { Pesticide };

export type PesticideFilter = { q?: string; type?: PesticideType; skip: number; take: number };

// Belum ada data obat mock: mode mock menampilkan daftar kosong.
export async function listPesticides(f: PesticideFilter) {
  if (!prisma) return { items: [] as Pesticide[], total: 0 };
  const where: Prisma.PesticideWhereInput = {
    ...(f.type ? { type: f.type } : {}),
    ...(f.q
      ? {
          OR: [
            { name: { contains: f.q, mode: "insensitive" } },
            { activeIngredient: { contains: f.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const [items, total] = await Promise.all([
    prisma.pesticide.findMany({ where, orderBy: { name: "asc" }, skip: f.skip, take: f.take }),
    prisma.pesticide.count({ where }),
  ]);
  return { items, total };
}

export async function pesticideCountByType(): Promise<Record<PesticideType, number> & { total: number }> {
  const out = { HERBISIDA: 0, INSEKTISIDA: 0, FUNGISIDA: 0, AKARISIDA: 0, total: 0 };
  if (!prisma) return out;
  const rows = await prisma.pesticide.groupBy({ by: ["type"], _count: { _all: true } });
  for (const r of rows) {
    out[r.type] = r._count._all;
    out.total += r._count._all;
  }
  return out;
}

export async function getPesticideById(id: string) {
  if (!prisma) return null;
  return prisma.pesticide.findUnique({ where: { id } });
}

function toData(input: PesticideInput) {
  return {
    ...input,
    slug: slugify(input.name),
    packaging: input.packaging || null,
    manufacturer: input.manufacturer || null,
    imageUrl: input.imageUrl || null,
  };
}

export async function createPesticide(input: PesticideInput) {
  return requireDb().pesticide.create({ data: toData(input) });
}

export async function updatePesticide(id: string, input: PesticideInput) {
  return requireDb().pesticide.update({ where: { id }, data: toData(input) });
}

export async function deletePesticide(id: string) {
  return requireDb().pesticide.delete({ where: { id } });
}
