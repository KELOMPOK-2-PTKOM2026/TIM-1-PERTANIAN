"use server";

import { revalidatePath } from "next/cache";
import { rateLimit } from "@/lib/rate-limit";
import { requireRole, requireUser } from "@/modules/auth/auth.guard";
import { toFormError, type AdminFormState } from "@/modules/admin/admin.shared";
import { answerSchema, questionSchema } from "./konsultasi.schema";
import { answerConsultation, createConsultation } from "./konsultasi.service";

function revalidateKonsultasi() {
  revalidatePath("/dashboard/konsultasi", "layout");
}

export async function askAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireUser();
  const parsed = questionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  if (!rateLimit(`ask:${user.id}`, 5, 60 * 60 * 1000)) {
    return { error: "Terlalu banyak pertanyaan. Coba lagi dalam 1 jam." };
  }

  try {
    await createConsultation(user.id, parsed.data);
  } catch (e) {
    return toFormError(e);
  }
  revalidateKonsultasi();
  return { ok: "Pertanyaan terkirim. Pakar akan segera menjawab." };
}

export async function answerAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireRole("PAKAR", "ADMIN");
  const parsed = answerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await answerConsultation(parsed.data.id, parsed.data.answer, user.name);
  } catch (e) {
    return toFormError(e);
  }
  revalidateKonsultasi();
  return { ok: "Jawaban terkirim." };
}
