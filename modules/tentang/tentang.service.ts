import { prisma } from "@/lib/db";
import { requireDb } from "@/modules/admin/admin.shared";
import { DEFAULT_TENTANG, tentangSchema, type TentangContent } from "./tentang.schema";

const KEY = "tentang";

// Konten tersimpan; jatuh ke DEFAULT_TENTANG bila belum ada/tidak valid/mode mock.
export async function getTentangContent(): Promise<TentangContent> {
  if (!prisma) return DEFAULT_TENTANG;
  try {
    const row = await prisma.siteContent.findUnique({ where: { key: KEY } });
    const parsed = tentangSchema.safeParse(row?.data);
    return parsed.success ? parsed.data : DEFAULT_TENTANG;
  } catch {
    return DEFAULT_TENTANG;
  }
}

export async function saveTentangContent(data: TentangContent) {
  return requireDb().siteContent.upsert({
    where: { key: KEY },
    create: { key: KEY, data },
    update: { data },
  });
}
