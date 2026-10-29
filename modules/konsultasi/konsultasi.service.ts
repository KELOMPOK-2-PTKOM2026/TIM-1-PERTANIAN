import type { Consultation, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { requireDb } from "@/modules/admin/admin.shared";
import type { QuestionInput } from "./konsultasi.schema";

export type { Consultation };

// Mode mock: daftar kosong, mutasi butuh database.
export async function listMine(userId: string) {
  if (!prisma) return [] as Consultation[];
  return prisma.consultation.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function listOpen() {
  if (!prisma) return [] as Consultation[];
  return prisma.consultation.findMany({ where: { status: "OPEN" }, orderBy: { createdAt: "asc" } });
}

export async function listAnswered(f: { q?: string; skip: number; take: number }) {
  if (!prisma) return { items: [] as Consultation[], total: 0 };
  const where: Prisma.ConsultationWhereInput = {
    status: "ANSWERED",
    ...(f.q
      ? {
          OR: [
            { question: { contains: f.q, mode: "insensitive" } },
            { answer: { contains: f.q, mode: "insensitive" } },
            { topic: { contains: f.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const [items, total] = await Promise.all([
    prisma.consultation.findMany({ where, orderBy: { answeredAt: "desc" }, skip: f.skip, take: f.take }),
    prisma.consultation.count({ where }),
  ]);
  return { items, total };
}

export async function createConsultation(userId: string, input: QuestionInput) {
  return requireDb().consultation.create({
    data: { ...input, whatsapp: input.whatsapp || null, userId },
  });
}

// Hanya pertanyaan OPEN yang bisa dijawab (cegah jawaban ganda).
export async function answerConsultation(id: string, answer: string, answeredBy: string) {
  const { count } = await requireDb().consultation.updateMany({
    where: { id, status: "OPEN" },
    data: { answer, answeredBy, status: "ANSWERED", answeredAt: new Date() },
  });
  if (!count) throw new AppError("Pertanyaan sudah dijawab atau tidak ditemukan", "NOT_FOUND");
}
