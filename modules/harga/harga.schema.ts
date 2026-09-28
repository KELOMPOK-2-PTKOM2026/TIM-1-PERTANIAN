import { z } from "zod";

const dateStr = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus yyyy-mm-dd");

// Validasi query GET /api/harga (F-P2-05). Semua opsional agar default tampil.
export const hargaQuerySchema = z
  .object({
    komoditas: z.string().trim().min(1).optional(),
    pasar: z.string().trim().min(1).optional(),
    from: dateStr.optional(),
    to: dateStr.optional(),
  })
  .refine((d) => !d.from || !d.to || d.from <= d.to, {
    message: "Rentang tanggal tidak valid (from harus <= to)",
    path: ["from"],
  });

// Validasi input harga harian oleh admin.
export const hargaUpsertSchema = z.object({
  commodityId: z.string().trim().min(1, "Komoditas wajib diisi"),
  marketId: z.string().trim().min(1, "Pasar wajib diisi"),
  price: z.coerce.number().int("Harga harus bilangan bulat").positive("Harga harus > 0"),
  date: dateStr,
});

export type HargaQueryInput = z.infer<typeof hargaQuerySchema>;
export type HargaUpsertInput = z.infer<typeof hargaUpsertSchema>;
