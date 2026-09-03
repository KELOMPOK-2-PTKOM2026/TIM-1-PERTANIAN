import { prisma } from "./db";
import {
  MOCK_ARTICLES,
  MOCK_COMMODITIES,
  MOCK_MARKETS,
  MOCK_PRICES,
  type Article,
  type ArticleCategory,
  type Commodity,
  type Market,
  type PricePoint,
} from "./mock";

export type { Article, ArticleCategory, Commodity, Market, PricePoint };
export { CATEGORY_LABEL } from "./mock";

export type ArticleFilter = { category?: ArticleCategory; q?: string };

// ---- Artikel ----
export async function getArticles(filter: ArticleFilter = {}): Promise<Article[]> {
  const { category, q } = filter;
  if (prisma) {
    try {
      const rows = await prisma.article.findMany({
        where: {
          ...(category ? { category } : {}),
          ...(q
            ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { tags: { has: q } }] }
            : {}),
        },
        orderBy: { publishedAt: "desc" },
      });
      return rows.map((r) => ({
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        contentMd: r.contentMd,
        category: r.category as ArticleCategory,
        tags: r.tags,
        publishedAt: (r.publishedAt ?? r.createdAt).toISOString(),
        views: r.views,
      }));
    } catch {
      // jatuh ke mock
    }
  }
  const query = (q ?? "").toLowerCase();
  return MOCK_ARTICLES.filter(
    (a) =>
      (!category || a.category === category) &&
      (!query ||
        a.title.toLowerCase().includes(query) ||
        a.tags.some((t) => t.toLowerCase().includes(query))),
  ).sort((x, y) => y.publishedAt.localeCompare(x.publishedAt));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (prisma) {
    try {
      const r = await prisma.article.findUnique({ where: { slug } });
      if (r)
        return {
          slug: r.slug,
          title: r.title,
          excerpt: r.excerpt,
          contentMd: r.contentMd,
          category: r.category as ArticleCategory,
          tags: r.tags,
          publishedAt: (r.publishedAt ?? r.createdAt).toISOString(),
          views: r.views,
        };
    } catch {
      // jatuh ke mock
    }
  }
  return MOCK_ARTICLES.find((a) => a.slug === slug) ?? null;
}

export async function getArticleSlugs(): Promise<string[]> {
  if (prisma) {
    try {
      const rows = await prisma.article.findMany({ select: { slug: true } });
      if (rows.length) return rows.map((r) => r.slug);
    } catch {
      // jatuh ke mock
    }
  }
  return MOCK_ARTICLES.map((a) => a.slug);
}

// ---- Harga pasar ----
export async function getCommodities(): Promise<Commodity[]> {
  if (prisma) {
    try {
      const rows = await prisma.commodity.findMany({ orderBy: { name: "asc" } });
      if (rows.length) return rows;
    } catch {
      // jatuh ke mock
    }
  }
  return MOCK_COMMODITIES;
}

export async function getMarkets(): Promise<Market[]> {
  if (prisma) {
    try {
      const rows = await prisma.market.findMany({ orderBy: { name: "asc" } });
      if (rows.length) return rows;
    } catch {
      // jatuh ke mock
    }
  }
  return MOCK_MARKETS;
}

export type PriceFilter = { commodityId?: string; marketId?: string; from?: string; to?: string };

export async function getPrices(filter: PriceFilter = {}): Promise<PricePoint[]> {
  const { commodityId, marketId, from, to } = filter;
  if (prisma) {
    try {
      const rows = await prisma.price.findMany({
        where: {
          ...(commodityId ? { commodityId } : {}),
          ...(marketId ? { marketId } : {}),
          ...(from || to
            ? { date: { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) } }
            : {}),
        },
        orderBy: { date: "asc" },
        take: 2000,
      });
      if (rows.length)
        return rows.map((r) => ({
          commodityId: r.commodityId,
          marketId: r.marketId,
          price: r.price,
          date: r.date.toISOString().slice(0, 10),
        }));
    } catch {
      // jatuh ke mock
    }
  }
  return MOCK_PRICES.filter(
    (p) =>
      (!commodityId || p.commodityId === commodityId) &&
      (!marketId || p.marketId === marketId) &&
      (!from || p.date >= from) &&
      (!to || p.date <= to),
  ).sort((a, b) => a.date.localeCompare(b.date));
}

export function isMockMode(): boolean {
  return !process.env.DATABASE_URL;
}
