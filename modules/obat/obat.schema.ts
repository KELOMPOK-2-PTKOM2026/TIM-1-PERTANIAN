import { z } from "zod";

export const PESTICIDE_TYPES = ["HERBISIDA", "INSEKTISIDA", "FUNGISIDA", "AKARISIDA", "PUPUK", "LAINNYA"] as const;
export type PesticideType = (typeof PESTICIDE_TYPES)[number];

export const PESTICIDE_TYPE_LABEL: Record<PesticideType, string> = {
  HERBISIDA: "Herbisida",
  INSEKTISIDA: "Insektisida",
  FUNGISIDA: "Fungisida",
  AKARISIDA: "Akarisida",
  PUPUK: "Pupuk & Nutrisi",
  LAINNYA: "Lainnya",
};

const optional = z.string().trim().max(120).default("");

// Terima "48.000", "48000", atau kosong → number/null (harga boleh tidak diisi).
const priceField = z.preprocess(
  (v) => {
    if (v === null || v === undefined) return null;
    const digits = String(v).replace(/[^\d]/g, "");
    return digits ? Number(digits) : null;
  },
  z.number().int("Harga harus berupa angka bulat").min(0, "Harga tidak boleh negatif").max(99999999, "Harga terlalu besar").nullable(),
);

export const pesticideSchema = z.object({
  name: z.string().trim().min(2, "Nama obat minimal 2 karakter").max(120),
  type: z.enum(PESTICIDE_TYPES, "Jenis obat tidak valid"),
  activeIngredient: z.string().trim().min(2, "Bahan aktif wajib diisi").max(200),
  targets: z.string().trim().min(3, "Sasaran hama/penyakit wajib diisi").max(500),
  dosage: z.string().trim().min(1, "Dosis anjuran wajib diisi").max(120),
  packaging: optional,
  manufacturer: optional,
  description: z.string().trim().default(""),
  imageUrl: z.union([z.literal(""), z.url({ protocol: /^https$/, error: "URL gambar harus https://" })]).default(""),
  price: priceField,
  phi: z.string().trim().max(60).default(""),
  tanamanSasaran: z.string().trim().max(500).default(""),
});

export type PesticideInput = z.infer<typeof pesticideSchema>;
