import { z } from "zod";

export const TOPIK = ["BUDIDAYA", "HAMA", "PESTISIDA", "PEMUPUKAN"] as const;
export type Topik = (typeof TOPIK)[number];

const whatsapp = z
  .string()
  .trim()
  .regex(/^(\+62|62|0)8\d{7,12}$/, "Nomor WhatsApp tidak valid")
  .optional()
  .or(z.literal(""));

// Form tanya di /dashboard/konsultasi (PRD F-P2-02).
export const konsultasiSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter"),
  city: z.string().trim().max(60).optional().or(z.literal("")),
  whatsapp,
  topic: z.enum(TOPIK),
  question: z
    .string()
    .trim()
    .min(20, "Pertanyaan minimal 20 karakter")
    .max(2000, "Pertanyaan maksimal 2000 karakter"),
});

// Jawaban pakar.
export const jawabanSchema = z.object({
  answer: z.string().trim().min(10, "Jawaban minimal 10 karakter").max(5000),
});

export type KonsultasiInput = z.infer<typeof konsultasiSchema>;
export type JawabanInput = z.infer<typeof jawabanSchema>;

export type KonsultasiStatus = "OPEN" | "ANSWERED";

export type Konsultasi = {
  id: string;
  userId: string;
  topic: Topik;
  question: string;
  answer?: string | null;
  answeredById?: string | null;
  status: KonsultasiStatus;
  createdAt: string;
};
