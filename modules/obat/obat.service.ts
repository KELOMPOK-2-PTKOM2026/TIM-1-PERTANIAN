import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors";
import type { Obat, ObatFilter, ObatInput } from "./obat.schema";

// Prisma client di env user bisa jadi belum di-generate ulang setelah
// migrasi Fase 2, jadi akses model baru lewat cast agar tsc tetap hijau.
function db() {
  if (!prisma) throw new AppError("Database tidak tersedia", "DB_UNAVAILABLE");
  return prisma as unknown as {
    pesticide: {
      findMany(a?: unknown): Promise<Obat[]>;
      findUnique(a: unknown): Promise<Obat | null>;
      create(a: unknown): Promise<Obat>;
      update(a: unknown): Promise<Obat>;
      delete(a: unknown): Promise<Obat>;
    };
  };
}

export function slugifyObat(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function toObat(r: Obat): Obat {
  return r;
}

export async function listObat(filter: ObatFilter = { publishedOnly: true }): Promise<Obat[]> {
  const { jenis, q, publishedOnly = true } = filter;
  const rows = await db().pesticide.findMany({
    where: {
      ...(publishedOnly ? { isPublished: true } : {}),
      ...(jenis ? { type: jenis } : {}),
      ...(q
        ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { bahanAktif: { contains: q, mode: "insensitive" } }] }
        : {}),
    },
    orderBy: { name: "asc" },
  });
  return rows.map(toObat);
}

export async function getObatBySlug(slug: string, includeUnpublished = false): Promise<Obat> {
  const row = await db().pesticide.findUnique({ where: { slug } });
  if (!row || (!includeUnpublished && !row.isPublished)) {
    throw new AppError("Obat tidak ditemukan", "NOT_FOUND");
  }
  return toObat(row);
}

export async function createObat(input: ObatInput, createdById?: string): Promise<Obat> {
  const slug = input.slug ?? slugifyObat(input.name);
  try {
    return await db().pesticide.create({
      data: { ...input, slug, createdById: createdById ?? null },
    });
  } catch {
    throw new AppError("Slug obat sudah dipakai", "SLUG_TAKEN");
  }
}

export async function updateObat(slug: string, input: Partial<ObatInput>): Promise<Obat> {
  await getObatBySlug(slug, true);
  return db().pesticide.update({ where: { slug }, data: input });
}

export async function toggleObatPublish(slug: string, isPublished: boolean): Promise<Obat> {
  await getObatBySlug(slug, true);
  return db().pesticide.update({ where: { slug }, data: { isPublished } });
}

export async function deleteObat(slug: string): Promise<void> {
  await getObatBySlug(slug, true);
  await db().pesticide.delete({ where: { slug } });
}
