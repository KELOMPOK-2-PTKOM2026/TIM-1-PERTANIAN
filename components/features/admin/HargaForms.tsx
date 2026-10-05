"use client";

import { useActionState, useEffect, useRef } from "react";
import type { AdminFormState } from "@/modules/admin/admin.shared";
import { createCommodityAction, createMarketAction, createPriceAction } from "@/modules/harga/harga.actions";
import FormMessage from "./FormMessage";
import { btnPrimary, card, Field, input } from "./ui";

type Action = (prev: AdminFormState, formData: FormData) => Promise<AdminFormState>;

// Form inline yang reset setelah sukses.
function InlineForm({ action, title, children }: { action: Action; title: string; children: React.ReactNode }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={formAction} className={`${card} space-y-3 p-5`}>
      <h2 className="font-bold text-[#084734]">{title}</h2>
      {children}
      <FormMessage state={state} />
      <button type="submit" disabled={pending} className={`${btnPrimary} w-full`}>
        {pending ? "Menyimpan…" : "Simpan"}
      </button>
    </form>
  );
}

export function PriceForm({
  commodities,
  markets,
}: {
  commodities: { id: string; name: string; unit: string }[];
  markets: { id: string; name: string }[];
}) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <InlineForm action={createPriceAction} title="Input harga harian">
      <Field label="Komoditas">
        <select name="commodityId" required className={input}>
          {commodities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} (/{c.unit})
            </option>
          ))}
        </select>
      </Field>
      <Field label="Pasar">
        <select name="marketId" required className={input}>
          {markets.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Harga (Rp)">
        <input name="price" type="number" min={1} step={50} required className={input} />
      </Field>
      <Field label="Tanggal">
        <input name="date" type="date" defaultValue={today} max={today} required className={input} />
      </Field>
    </InlineForm>
  );
}

export function CommodityForm() {
  return (
    <InlineForm action={createCommodityAction} title="Tambah komoditas">
      <Field label="Nama">
        <input name="name" required className={input} />
      </Field>
      <Field label="Satuan">
        <input name="unit" defaultValue="kg" required className={input} />
      </Field>
    </InlineForm>
  );
}

export function MarketForm() {
  return (
    <InlineForm action={createMarketAction} title="Tambah pasar">
      <Field label="Nama pasar">
        <input name="name" required className={input} />
      </Field>
      <Field label="Kota">
        <input name="city" required className={input} />
      </Field>
    </InlineForm>
  );
}
