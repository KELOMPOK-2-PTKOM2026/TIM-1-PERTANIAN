"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/modules/auth/auth.guard";
import { toFormError, type AdminFormState } from "@/modules/admin/admin.shared";
import { commoditySchema, marketSchema, priceSchema } from "./harga.schema";
import {
  createCommodity,
  createMarket,
  createPrice,
  deleteCommodity,
  deleteMarket,
  deletePrice,
} from "./harga.service";

function revalidateHarga() {
  revalidatePath("/admin", "layout");
  revalidatePath("/harga-pasar");
  revalidatePath("/");
}

export async function createPriceAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireRole("ADMIN");
  const parsed = priceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await createPrice(parsed.data);
  } catch (e) {
    return toFormError(e);
  }
  revalidateHarga();
  return { ok: "Harga tersimpan" };
}

export async function createCommodityAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireRole("ADMIN");
  const parsed = commoditySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await createCommodity(parsed.data);
  } catch (e) {
    return toFormError(e);
  }
  revalidateHarga();
  return { ok: "Komoditas ditambahkan" };
}

export async function createMarketAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireRole("ADMIN");
  const parsed = marketSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await createMarket(parsed.data);
  } catch (e) {
    return toFormError(e);
  }
  revalidateHarga();
  return { ok: "Pasar ditambahkan" };
}

export async function deletePriceAction(formData: FormData) {
  await requireRole("ADMIN");
  await deletePrice(String(formData.get("id")));
  revalidateHarga();
}

// Hapus komoditas/pasar ikut menghapus data harganya (onDelete: Cascade).
export async function deleteCommodityAction(formData: FormData) {
  await requireRole("ADMIN");
  await deleteCommodity(String(formData.get("id")));
  revalidateHarga();
}

export async function deleteMarketAction(formData: FormData) {
  await requireRole("ADMIN");
  await deleteMarket(String(formData.get("id")));
  revalidateHarga();
}
