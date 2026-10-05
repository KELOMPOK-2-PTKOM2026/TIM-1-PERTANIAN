import { z } from "zod";

export const priceSchema = z.object({
  commodityId: z.string().min(1, "Pilih komoditas"),
  marketId: z.string().min(1, "Pilih pasar"),
  price: z.coerce.number().int("Harga harus bilangan bulat").positive("Harga harus lebih dari 0"),
  date: z.iso.date("Tanggal tidak valid"),
});

export const commoditySchema = z.object({
  name: z.string().trim().min(2, "Nama komoditas minimal 2 karakter").max(80),
  unit: z.string().trim().min(1, "Satuan wajib diisi").max(20).default("kg"),
});

export const marketSchema = z.object({
  name: z.string().trim().min(2, "Nama pasar minimal 2 karakter").max(80),
  city: z.string().trim().min(2, "Kota wajib diisi").max(80),
});

export type PriceInput = z.infer<typeof priceSchema>;
export type CommodityInput = z.infer<typeof commoditySchema>;
export type MarketInput = z.infer<typeof marketSchema>;
