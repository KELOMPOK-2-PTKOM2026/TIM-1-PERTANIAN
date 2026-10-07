"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { AdminFormState } from "@/modules/admin/admin.shared";
import { createCommodityAction, createMarketAction, createPriceAction } from "@/modules/harga/harga.actions";
import FormMessage from "./FormMessage";
import { formatRupiah, formatTanggal } from "@/lib/format";
import type { LastPrice } from "@/modules/harga/harga.service";
import { btnPrimary, card, Field, input } from "./ui";

type Action = (prev: AdminFormState, formData: FormData) => Promise<AdminFormState>;

// Form inline yang reset setelah sukses.
function InlineForm({
  action,
  title,
  children,
  onSuccess,
}: {
  action: Action;
  title: string;
  children: React.ReactNode;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);
  // Simpan callback di ref supaya efek hanya jalan saat state berubah.
  const onSuccessRef = useRef(onSuccess);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  });
  useEffect(() => {
    if (state?.ok) {
      ref.current?.reset();
      onSuccessRef.current?.();
    }
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
  lastPrices,
}: {
  commodities: { id: string; name: string; unit: string }[];
  markets: { id: string; name: string }[];
  lastPrices: Record<string, LastPrice>;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [commodityId, setCommodityId] = useState(commodities[0]?.id ?? "");
  const [marketId, setMarketId] = useState(markets[0]?.id ?? "");
  const [price, setPrice] = useState("");
  const unit = commodities.find((c) => c.id === commodityId)?.unit ?? "kg";
  const last = lastPrices[`${commodityId}:${marketId}`];

  return (
    <InlineForm action={createPriceAction} title="Input harga harian" onSuccess={() => setPrice("")}>
      <Field label="Komoditas">
        <select name="commodityId" required className={input} value={commodityId} onChange={(e) => setCommodityId(e.target.value)}>
          {commodities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} (/{c.unit})
            </option>
          ))}
        </select>
      </Field>
      <Field label="Pasar">
        <select name="marketId" required className={input} value={marketId} onChange={(e) => setMarketId(e.target.value)}>
          {markets.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </Field>
      <PrevPrice last={last} unit={unit} price={Number(price)} />
      <Field label="Harga (Rp)">
        <input
          name="price"
          type="number"
          min={1}
          step={50}
          required
          className={input}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </Field>
      <Field label="Tanggal">
        <input name="date" type="date" defaultValue={today} max={today} required className={input} />
      </Field>
    </InlineForm>
  );
}

// Info harga sebelumnya + selisih terhadap harga yang sedang diketik.
function PrevPrice({ last, unit, price }: { last?: LastPrice; unit: string; price: number }) {
  if (!last) {
    return <p className="rounded-lg bg-stone-50 px-3 py-2 text-xs text-stone-500">Belum ada harga sebelumnya untuk pasangan ini.</p>;
  }
  const pct = price > 0 ? ((price - last.price) / last.price) * 100 : null;
  const tone =
    pct === null || pct === 0 ? "text-stone-600" : pct > 0 ? "text-red-600" : "text-emerald-700";
  return (
    <div className="rounded-lg bg-stone-50 px-3 py-2 text-xs">
      <p className="text-stone-500">Harga sebelumnya ({formatTanggal(last.date)})</p>
      <p className="mt-0.5 flex items-baseline justify-between gap-2">
        <span className="text-sm font-bold text-[#084734]">
          {formatRupiah(last.price)}/{unit}
        </span>
        {pct !== null && (
          <span className={`font-semibold ${tone}`}>
            {pct > 0 ? "▲" : pct < 0 ? "▼" : "="} {Math.abs(pct).toFixed(1)}%
          </span>
        )}
      </p>
      {pct !== null && Math.abs(pct) >= 50 && (
        <p className="mt-1 font-semibold text-amber-700">Selisih besar — cek lagi angkanya.</p>
      )}
    </div>
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
