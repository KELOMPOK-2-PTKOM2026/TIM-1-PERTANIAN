import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { getArticleBySlug } from "@/lib/data";
import type { ArtikelInput } from "./artikel.schema";

function db() {
  if (!prisma) throw new AppError("Database tidak tersedia", "DB_UNAVAILABLE");
  return prisma;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function parseDate(value?: string): Date | null {
  if (!value) return null;
  const d = new Date(value.length === 10 ? value + "T00:00:00" : value);
  return Number.isNaN(d.getTime()) ? null : d;
}

// CRUD admin. Baca publik tetap lewat lib/data.ts (mock fallback).
export async function createArticle(input: ArtikelInput) {
  const slug = input.slug ?? slugify(input.title);
  const existing = await getArticleBySlug(slug);
  if (existing) throw new AppError("Slug artikel sudah dipakai", "SLUG_TAKEN");

  return db().article.create({
    data: {
      slug,
      title: input.title,
      excerpt: input.excerpt,
      contentMd: input.contentMd,
      coverUrl: input.coverUrl || null,
      category: input.category as "PENGETAHUAN" | "KIAT" | "SOLUSI" | "INSPIRASI",
      tags: input.tags,
      publishedAt: parseDate(input.publishedAt),
    },
  });
}

export async function updateArticle(slug: string, input: Partial<ArtikelInput>) {
  const existing = await db().article.findUnique({ where: { slug } });
  if (!existing) throw new AppError("Artikel tidak ditemukan", "NOT_FOUND");

  return db().article.update({
    where: { slug },
    data: {
      ...(input.title ? { title: input.title } : {}),
      ...(input.excerpt ? { excerpt: input.excerpt } : {}),
      ...(input.contentMd ? { contentMd: input.contentMd } : {}),
      ...(input.coverUrl !== undefined ? { coverUrl: input.coverUrl || null } : {}),
      ...(input.category ? { category: input.category as "PENGETAHUAN" } : {}),
      ...(input.tags ? { tags: input.tags } : {}),
      ...(input.publishedAt !== undefined ? { publishedAt: parseDate(input.publishedAt) } : {}),
    },
  });
}

export async function deleteArticle(slug: string): Promise<void> {
  const existing = await db().article.findUnique({ where: { slug } });
  if (!existing) throw new AppError("Artikel tidak ditemukan", "NOT_FOUND");
  await db().article.delete({ where: { slug } });
}

export async function incrementViews(slug: string): Promise<void> {
  if (!prisma) return; // mode mock: abaikan
  try {
    await prisma.article.update({ where: { slug }, data: { views: { increment: 1 } } });
  } catch {
    // slug mock — abaikan
  }
}
