import type { Article as ArticleRow, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { MOCK_ARTICLES, type ArticleCategory } from "@/lib/mock";
import { requireDb, slugify } from "@/modules/admin/admin.shared";
import type { ArticleInput } from "./artikel.schema";

export type AdminArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentMd: string;
  coverUrl: string | null;
  author: string | null;
  category: ArticleCategory;
  tags: string[];
  publishedAt: string | null;
  views: number;
  createdAt: string;
};

export type AdminArticleFilter = {
  q?: string;
  category?: ArticleCategory;
  status?: "draft" | "publish";
  skip: number;
  take: number;
};

const MOCK_ADMIN: AdminArticle[] = MOCK_ARTICLES.map((a) => ({
  ...a,
  id: a.slug,
  coverUrl: null,
  author: a.author || null,
  createdAt: a.publishedAt,
}));

export async function listArticles(f: AdminArticleFilter) {
  if (!prisma) {
    const q = (f.q ?? "").toLowerCase();
    const all = MOCK_ADMIN.filter(
      (a) =>
        (!f.category || a.category === f.category) &&
        f.status !== "draft" &&
        (!q || a.title.toLowerCase().includes(q)),
    );
    return { items: all.slice(f.skip, f.skip + f.take), total: all.length };
  }
  const where: Prisma.ArticleWhereInput = {
    ...(f.category ? { category: f.category } : {}),
    ...(f.status === "draft" ? { publishedAt: null } : {}),
    ...(f.status === "publish" ? { publishedAt: { not: null } } : {}),
    ...(f.q ? { title: { contains: f.q, mode: "insensitive" } } : {}),
  };
  const [rows, total] = await Promise.all([
    prisma.article.findMany({ where, orderBy: { createdAt: "desc" }, skip: f.skip, take: f.take }),
    prisma.article.count({ where }),
  ]);
  return { items: rows.map(toAdmin), total };
}

export async function articleStats() {
  if (!prisma) {
    const views = MOCK_ADMIN.reduce((s, a) => s + a.views, 0);
    return { total: MOCK_ADMIN.length, published: MOCK_ADMIN.length, drafts: 0, views, newThisMonth: 0 };
  }
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const [total, drafts, agg, newThisMonth] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { publishedAt: null } }),
    prisma.article.aggregate({ _sum: { views: true } }),
    prisma.article.count({ where: { createdAt: { gte: monthStart } } }),
  ]);
  return { total, published: total - drafts, drafts, views: agg._sum.views ?? 0, newThisMonth };
}

export async function getArticleById(id: string): Promise<AdminArticle | null> {
  if (!prisma) return MOCK_ADMIN.find((a) => a.id === id) ?? null;
  const r = await prisma.article.findUnique({ where: { id } });
  return r ? toAdmin(r) : null;
}

function toData(input: ArticleInput, currentPublishedAt?: Date | null) {
  const slug = slugify(input.slug || input.title);
  if (!slug) throw new AppError("Slug tidak valid");
  return {
    title: input.title,
    slug,
    excerpt: input.excerpt,
    contentMd: input.contentMd,
    coverUrl: input.coverUrl || null,
    author: input.author || null,
    category: input.category,
    tags: input.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    publishedAt: input.status === "publish" ? (currentPublishedAt ?? new Date()) : null,
  };
}

export async function createArticle(input: ArticleInput) {
  return requireDb().article.create({ data: toData(input) });
}

export async function updateArticle(id: string, input: ArticleInput) {
  const db = requireDb();
  const current = await db.article.findUnique({ where: { id } });
  if (!current) throw new AppError("Artikel tidak ditemukan", "NOT_FOUND");
  return db.article.update({ where: { id }, data: toData(input, current.publishedAt) });
}

export async function setArticlePublished(id: string, publish: boolean) {
  return requireDb().article.update({ where: { id }, data: { publishedAt: publish ? new Date() : null } });
}

export async function deleteArticle(id: string) {
  return requireDb().article.delete({ where: { id } });
}

function toAdmin(r: ArticleRow): AdminArticle {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    contentMd: r.contentMd,
    coverUrl: r.coverUrl,
    author: r.author,
    category: r.category as ArticleCategory,
    tags: r.tags,
    publishedAt: r.publishedAt?.toISOString() ?? null,
    views: r.views,
    createdAt: r.createdAt.toISOString(),
  };
}
