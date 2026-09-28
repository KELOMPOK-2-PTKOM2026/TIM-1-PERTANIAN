"use server";

import { revalidatePath } from "next/cache";
import { AppError, toHttpStatus } from "@/lib/errors";
import { getCurrentUser, requireRole } from "@/modules/auth/auth.guard";
import { jawabanSchema, konsultasiSchema } from "./konsultasi.schema";
import {
  answerConsultation,
  createConsultation,
} from "./konsultasi.service";

export type KonsultasiFormState = { error?: string; ok?: boolean } | undefined;

// Aksi form tanya (wajib login).
export async function createConsultationAction(
  _prev: KonsultasiFormState,
  formData: FormData,
): Promise<KonsultasiFormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Silakan login dulu" };

  const parsed = konsultasiSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await createConsultation(user.id, parsed.data);
  } catch (e) {
    if (e instanceof AppError) {
      void toHttpStatus(e.code);
      return { error: e.message };
    }
    throw e;
  }
  revalidatePath("/dashboard/konsultasi");
  return { ok: true };
}

// Aksi jawab (PAKAR / ADMIN).
export async function answerConsultationAction(
  id: string,
  _prev: KonsultasiFormState,
  formData: FormData,
): Promise<KonsultasiFormState> {
  const pakar = await requireRole("PAKAR", "ADMIN").catch(() => null);
  if (!pakar) return { error: "Hanya pakar/admin yang bisa menjawab" };

  const parsed = jawabanSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await answerConsultation(id, pakar.id, parsed.data.answer);
  } catch (e) {
    if (e instanceof AppError) return { error: e.message };
    throw e;
  }
  revalidatePath("/dashboard/konsultasi");
  revalidatePath("/dashboard/konsultasi/arsip");
  return { ok: true };
}
