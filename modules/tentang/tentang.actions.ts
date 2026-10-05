"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/modules/auth/auth.guard";
import { toFormError, type AdminFormState } from "@/modules/admin/admin.shared";
import { tentangSchema } from "./tentang.schema";
import { saveTentangContent } from "./tentang.service";

// Form mengirim seluruh konten sebagai JSON di field "data" (daftar kartu dinamis).
export async function saveTentangAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireRole("ADMIN");
  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("data") ?? ""));
  } catch {
    return { error: "Data form tidak valid" };
  }
  const parsed = tentangSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await saveTentangContent(parsed.data);
  } catch (e) {
    return toFormError(e);
  }
  revalidatePath("/tentang");
  revalidatePath("/admin/tentang");
  return { ok: "Halaman Tentang tersimpan" };
}
