import { z } from "zod";

export const ARTICLE_CATEGORIES = ["PENGETAHUAN", "KIAT", "SOLUSI", "INSPIRASI"] as const;
export type ArticleCategoryInput = (typeof ARTICLE_CATEGORIES)[number];

export const artikelInputSchema = z.object({
  title: z.string().trim().min(10, "Judul minimal 10 karakter").max(160),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug harus huruf kecil, angka, dan strip")
    .optional(),
  excerpt: z.string().trim().min(20, "Excerpt minimal 20 karakter").max(300),
  contentMd: z.string().trim().min(50, "Konten minimal 50 karakter"),
  coverUrl: z.string().trim().optional().or(z.literal("")),
  category: z.enum(ARTICLE_CATEGORIES),
  tags: z.array(z.string().trim().min(1)).max(10).default([]),
  publishedAt: z.string().trim().optional().or(z.literal("")),
});

export type ArtikelInput = z.infer<typeof artikelInputSchema>;
