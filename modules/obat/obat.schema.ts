import { z } from "zod";

export const PESTICIDE_TYPES = ["HERBISIDA", "INSEKTISIDA", "FUNGISIDA", "AKARISIDA"] as const;
export type PesticideType = (typeof PESTICIDE_TYPES)[number];

export const PESTICIDE_TYPE_LABEL: Record<PesticideType, string> = {
  HERBISIDA: "Herbisida",
  INSEKTISIDA: "Insektisida",
  FUNGISIDA: "Fungisida",
  AKARISIDA: "Akarisida",
};

const optional = z.string().trim().max(120).default("");

export const pesticideSchema = z.object({
  name: z.string().trim().min(2, "Nama obat minimal 2 karakter").max(120),
  type: z.enum(PESTICIDE_TYPES, "Jenis obat tidak valid"),
  activeIngredient: z.string().trim().min(2, "Bahan aktif wajib diisi").max(200),
  targets: z.string().trim().min(3, "Sasaran hama/penyakit wajib diisi").max(500),
  dosage: z.string().trim().min(1, "Dosis anjuran wajib diisi").max(120),
  packaging: optional,
  manufacturer: optional,
  description: z.string().trim().default(""),
  imageUrl: z.union([z.literal(""), z.url("URL gambar tidak valid")]).default(""),
});

export type PesticideInput = z.infer<typeof pesticideSchema>;
