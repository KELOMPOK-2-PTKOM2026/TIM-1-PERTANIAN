"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/modules/auth/auth.guard";
import { requireDb, toFormError, type AdminFormState } from "./admin.shared";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
  city: z.string().trim().max(80).default(""),
  whatsapp: z.string().trim().max(20).default(""),
});

export async function updateProfileAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireRole("ADMIN");
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await requireDb().user.update({
      where: { id: user.id },
      data: { name: parsed.data.name, city: parsed.data.city || null, whatsapp: parsed.data.whatsapp || null },
    });
  } catch (e) {
    return toFormError(e);
  }
  revalidatePath("/admin/pengaturan");
  return { ok: "Profil tersimpan. Nama di sidebar diperbarui setelah login ulang." };
}
