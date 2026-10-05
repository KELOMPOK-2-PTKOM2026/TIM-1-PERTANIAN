"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/modules/auth/auth.guard";
import { toFormError, type AdminFormState } from "@/modules/admin/admin.shared";
import { articleSchema } from "./artikel.schema";
import { createArticle, deleteArticle, setArticlePublished, updateArticle } from "./artikel.service";

function revalidateArticles() {
  revalidatePath("/admin", "layout");
  revalidatePath("/artikel", "layout");
  revalidatePath("/");
}

export async function saveArticleAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireRole("ADMIN");
  const parsed = articleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const id = formData.get("id");
  try {
    if (typeof id === "string" && id) await updateArticle(id, parsed.data);
    else await createArticle(parsed.data);
  } catch (e) {
    return toFormError(e);
  }
  revalidateArticles();
  redirect("/admin/artikel");
}

export async function togglePublishAction(formData: FormData) {
  await requireRole("ADMIN");
  await setArticlePublished(String(formData.get("id")), formData.get("publish") === "1");
  revalidateArticles();
}

export async function deleteArticleAction(formData: FormData) {
  await requireRole("ADMIN");
  await deleteArticle(String(formData.get("id")));
  revalidateArticles();
}
