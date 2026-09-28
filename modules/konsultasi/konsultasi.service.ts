import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors";
import type { Konsultasi, KonsultasiInput } from "./konsultasi.schema";

function db() {
  if (!prisma) throw new AppError("Database tidak tersedia", "DB_UNAVAILABLE");
  return prisma as unknown as {
    consultation: {
      findMany(a?: unknown): Promise<Record<string, unknown>[]>;
      findUnique(a: unknown): Promise<Record<string, unknown> | null>;
      create(a: unknown): Promise<Record<string, unknown>>;
      update(a: unknown): Promise<Record<string, unknown>>;
    };
  };
}

function toKonsultasi(r: Record<string, unknown>): Konsultasi {
  return {
    id: r.id as string,
    userId: r.userId as string,
    topic: r.topic as Konsultasi["topic"],
    question: r.question as string,
    answer: (r.answer as string | null) ?? null,
    answeredById: (r.answeredById as string | null) ?? null,
    status: r.status as Konsultasi["status"],
    createdAt: (r.createdAt as Date).toISOString(),
  };
}

// Buat pertanyaan baru milik user yang login.
export async function createConsultation(
  userId: string,
  input: KonsultasiInput,
): Promise<Konsultasi> {
  // Sinkronkan profil (nama/kota/WA boleh berubah per form).
  if (prisma) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          name: input.name,
          ...(input.city ? { city: input.city } : {}),
          ...(input.whatsapp ? { whatsapp: input.whatsapp } : {}),
        },
      });
    } catch {
      // user mungkin mock — lanjut buat konsultasi
    }
  }
  const row = await db().consultation.create({
    data: { userId, topic: input.topic, question: input.question, status: "OPEN" },
  });
  return toKonsultasi(row);
}

// Riwayat milik sendiri (dashboard).
export async function listMyConsultations(userId: string): Promise<Konsultasi[]> {
  const rows = await db().consultation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toKonsultasi);
}

// Arsip Q&A publik yang sudah dijawab (read-only).
export async function listAnsweredArchive(limit = 50): Promise<Konsultasi[]> {
  const rows = await db().consultation.findMany({
    where: { status: "ANSWERED" },
    orderBy: { createdAt: "desc" },
    take: Math.min(Math.max(limit, 1), 200),
  });
  return rows.map(toKonsultasi);
}

// Pakar/Admin menjawab -> status OPEN menjadi ANSWERED.
export async function answerConsultation(
  id: string,
  pakarId: string,
  answer: string,
): Promise<Konsultasi> {
  const existing = await db().consultation.findUnique({ where: { id } });
  if (!existing) throw new AppError("Konsultasi tidak ditemukan", "NOT_FOUND");
  const row = await db().consultation.update({
    where: { id },
    data: { answer, answeredById: pakarId, status: "ANSWERED" },
  });
  return toKonsultasi(row);
}
