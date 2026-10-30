import { z } from "zod";

export const TOPICS = ["Hama & Penyakit", "Pupuk & Nutrisi", "Budidaya", "Pasca Panen", "Lainnya"] as const;

export const questionSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(120),
  city: z.string().trim().min(2, "Kota wajib diisi").max(120),
  whatsapp: z.string().trim().max(30).default(""),
  topic: z.enum(TOPICS, "Topik tidak valid"),
  question: z
    .string()
    .trim()
    .min(20, "Pertanyaan minimal 20 karakter")
    .max(2000, "Pertanyaan maksimal 2000 karakter"),
});

export const answerSchema = z.object({
  id: z.string().min(1),
  answer: z.string().trim().min(10, "Jawaban minimal 10 karakter").max(5000),
});

export type QuestionInput = z.infer<typeof questionSchema>;
