"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Pesticide } from "@prisma/client";
import { savePesticideAction } from "@/modules/obat/obat.actions";
import { PESTICIDE_TYPE_LABEL } from "@/modules/obat/obat.schema";
import FormMessage from "./FormMessage";
import { btnGhost, btnPrimary, card, Field, input } from "./ui";

export default function PesticideForm({ item, readOnly }: { item?: Pesticide; readOnly?: boolean }) {
  const [state, action, pending] = useActionState(savePesticideAction, undefined);

  return (
    <form action={action} className={`${card} space-y-4 p-6`}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama dagang">
          <input name="name" required defaultValue={item?.name} className={input} />
        </Field>
        <Field label="Jenis">
          <select name="type" defaultValue={item?.type ?? "INSEKTISIDA"} className={input}>
            {Object.entries(PESTICIDE_TYPE_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Bahan aktif">
          <input name="activeIngredient" required defaultValue={item?.activeIngredient} className={input} />
        </Field>
        <Field label="Dosis anjuran">
          <input name="dosage" required defaultValue={item?.dosage} placeholder="0,5 ml/liter air" className={input} />
        </Field>
        <Field label="Kemasan">
          <input name="packaging" defaultValue={item?.packaging ?? ""} className={input} />
        </Field>
        <Field label="Produsen">
          <input name="manufacturer" defaultValue={item?.manufacturer ?? ""} className={input} />
        </Field>
      </div>
      <Field label="Sasaran hama / penyakit">
        <textarea name="targets" required rows={2} defaultValue={item?.targets} className={input} />
      </Field>
      <Field label="Deskripsi & catatan keamanan">
        <textarea name="description" rows={5} defaultValue={item?.description} className={input} />
      </Field>
      <Field label="URL gambar">
        <input name="imageUrl" type="url" defaultValue={item?.imageUrl ?? ""} className={input} />
      </Field>
      <FormMessage state={state} />
      <div className="flex gap-2">
        <button type="submit" disabled={pending || readOnly} className={btnPrimary}>
          {pending ? "Menyimpan…" : "Simpan"}
        </button>
        <Link href="/admin/obat" className={btnGhost}>
          Batal
        </Link>
      </div>
    </form>
  );
}
