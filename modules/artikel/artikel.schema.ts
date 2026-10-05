import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().trim().min(5, "Judul minimal 5 karakter").max(160),
  slug: z.string().trim().max(80).default(""),
  excerpt: z.string().trim().min(10, "Ringkasan minimal 10 karakter").max(300),
  contentMd: z.string().trim().min(20, "Isi artikel minimal 20 karakter"),
  author: z.string().trim().max(80).default(""),
  coverUrl: z.union([z.literal(""), z.url("URL cover tidak valid")]).default(""),
  category: z.enum(["PENGETAHUAN", "KIAT", "SOLUSI", "INSPIRASI"], "Kategori tidak valid"),
  tags: z.string().default(""),
  status: z.enum(["draft", "publish"]).default("draft"),
});

export type ArticleInput = z.infer<typeof articleSchema>;
