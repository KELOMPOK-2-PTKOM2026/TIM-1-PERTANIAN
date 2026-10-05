import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors";

// State Server Action admin untuk useActionState.
export type AdminFormState = { error?: string; ok?: string } | undefined;

// Semua mutasi admin butuh database; mode mock = read-only.
export function requireDb() {
  if (!prisma) throw new AppError("Mode mock: hubungkan DATABASE_URL untuk menyimpan perubahan", "NO_DB");
  return prisma;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Ubah error service jadi state form; error lain dilempar ulang.
export function toFormError(e: unknown): AdminFormState {
  if (e instanceof AppError) return { error: e.message };
  if (e && typeof e === "object" && "code" in e && e.code === "P2002")
    return { error: "Data dengan nama/slug yang sama sudah ada" };
  throw e;
}

export function pageParams(sp: { page?: string; per?: string }, defaultPer = 5) {
  const per = [5, 10, 20].includes(Number(sp.per)) ? Number(sp.per) : defaultPer;
  const page = Math.max(1, Number(sp.page) || 1);
  return { page, per, skip: (page - 1) * per };
}
