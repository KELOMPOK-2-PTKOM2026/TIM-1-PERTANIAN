"use client";

import { useActionState, useEffect, useRef } from "react";
import { askAction } from "@/modules/konsultasi/konsultasi.actions";
import { TOPICS } from "@/modules/konsultasi/konsultasi.schema";
import FormMessage from "@/components/features/admin/FormMessage";
import { Spinner } from "@/components/ui/button";
import { fieldClass } from "./styles";

const labelClass = "mb-1.5 block text-sm font-semibold text-stone-900";

export default function AskForm({
  defaults,
}: {
  defaults: { name: string; city: string; whatsapp: string };
}) {
  const [state, action, pending] = useActionState(askAction, undefined);
  const questionRef = useRef<HTMLTextAreaElement>(null);

  // Kosongkan pertanyaan setelah terkirim, data diri tetap.
  useEffect(() => {
    if (state?.ok && questionRef.current) questionRef.current.value = "";
  }, [state]);

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="name" className={labelClass}>Nama</label>
          <input id="name" name="name" required minLength={2} defaultValue={defaults.name} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="city" className={labelClass}>Kota / Kabupaten</label>
          <input id="city" name="city" required minLength={2} defaultValue={defaults.city} placeholder="Malang" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="whatsapp" className={labelClass}>WhatsApp <span className="font-normal text-stone-500">(opsional)</span></label>
          <input id="whatsapp" name="whatsapp" type="tel" defaultValue={defaults.whatsapp} placeholder="0812-3456-7890" className={fieldClass} />
        </div>
      </div>

      <div>
        <label htmlFor="topic" className={labelClass}>Topik</label>
        <select id="topic" name="topic" required defaultValue="" className={fieldClass}>
          <option value="" disabled>Pilih topik</option>
          {TOPICS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="question" className={labelClass}>Pertanyaan</label>
        <textarea
          ref={questionRef}
          id="question"
          name="question"
          required
          minLength={20}
          maxLength={2000}
          rows={5}
          placeholder="Ceritakan masalahmu: tanaman apa, gejalanya, sudah berapa lama…"
          className={fieldClass}
        />
        <p className="mt-1 text-xs text-stone-500">Minimal 20 karakter.</p>
      </div>

      <FormMessage state={state} />

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand-400 px-6 py-2.5 text-sm font-semibold text-brand-950 shadow-sm transition hover:bg-brand-300 disabled:opacity-60"
      >
        {pending ? (
          <span className="inline-flex items-center gap-2">
            <Spinner /> Mengirim…
          </span>
        ) : (
          "Kirim Pertanyaan"
        )}
      </button>
    </form>
  );
}
