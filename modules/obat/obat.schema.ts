import { z } from "zod";

export const OBAT_JENIS = ["HERBISIDA", "INSEKTISIDA", "FUNGISIDA", "AKARISIDA"] as const;
export type ObatJenis = (typeof OBAT_JENIS)[number];

export const obatInputSchema = z.object({
  name: z.string().trim().min(3, "Nama obat minimal 3 karakter"),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug harus huruf kecil, angka, dan strip")
    .optional(),
  type: z.enum(OBAT_JENIS),
  bahanAktif: z.string().trim().min(2, "Bahan aktif wajib diisi"),
  target: z.array(z.string().trim().min(1)).min(1, "Minimal 1 target hama"),
  tanamanCocok: z.array(z.string().trim().min(1)).min(1, "Minimal 1 tanaman cocok"),
  dosis: z.string().trim().min(2, "Dosis wajib diisi"),
  caraPakai: z.string().trim().min(10, "Cara pakai minimal 10 karakter"),
  keamanan: z.string().trim().min(10, "Info keamanan minimal 10 karakter"),
  rekomendasi: z.string().trim().optional(),
  coverUrl: z.string().trim().optional(),
  isPublished: z.boolean().default(true),
});

export const obatFilterSchema = z.object({
  jenis: z.enum(OBAT_JENIS).optional(),
  q: z.string().trim().optional(),
  publishedOnly: z.boolean().default(true),
});

export type ObatInput = z.infer<typeof obatInputSchema>;
export type ObatFilter = z.infer<typeof obatFilterSchema>;

export type Obat = {
  id: string;
  slug: string;
  name: string;
  type: ObatJenis;
  bahanAktif: string;
  target: string[];
  tanamanCocok: string[];
  dosis: string;
  caraPakai: string;
  keamanan: string;
  rekomendasi?: string | null;
  coverUrl?: string | null;
  isPublished: boolean;
};
