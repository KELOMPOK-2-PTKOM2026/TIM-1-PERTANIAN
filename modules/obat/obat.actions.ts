"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/modules/auth/auth.guard";
import { toFormError, type AdminFormState } from "@/modules/admin/admin.shared";
import { pesticideSchema } from "./obat.schema";
import { createPesticide, deletePesticide, updatePesticide } from "./obat.service";

function revalidateObat() {
  revalidatePath("/admin", "layout");
  revalidatePath("/obat", "layout");
}

export async function savePesticideAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireRole("ADMIN");
  const parsed = pesticideSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const id = formData.get("id");
  try {
    if (typeof id === "string" && id) await updatePesticide(id, parsed.data);
    else await createPesticide(parsed.data);
  } catch (e) {
    return toFormError(e);
  }
  revalidateObat();
  redirect("/admin/obat");
}

export async function deletePesticideAction(formData: FormData) {
  await requireRole("ADMIN");
  await deletePesticide(String(formData.get("id")));
  revalidateObat();
}
