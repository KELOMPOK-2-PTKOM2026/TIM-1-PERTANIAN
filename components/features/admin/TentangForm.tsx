"use client";

import { useActionState, useState } from "react";
import { saveTentangAction } from "@/modules/tentang/tentang.actions";
import type { TentangContent } from "@/modules/tentang/tentang.schema";
import FormMessage from "./FormMessage";
import { ADMIN_ICON, AdminIcon, btnGhost, btnPrimary, card, Field, input } from "./ui";

type ListKey = "missions" | "journey" | "team";

const EMPTY: { [K in ListKey]: TentangContent[K][number] } = {
  missions: { title: "", description: "" },
  journey: { year: String(new Date().getFullYear()), title: "", description: "" },
  team: { name: "", role: "", photoUrl: "" },
};

export default function TentangForm({ initial, readOnly }: { initial: TentangContent; readOnly?: boolean }) {
  const [state, action, pending] = useActionState(saveTentangAction, undefined);
  const [data, setData] = useState(initial);

  const set = <K extends keyof TentangContent>(k: K, v: TentangContent[K]) => setData((d) => ({ ...d, [k]: v }));

  function setItem<K extends ListKey>(k: K, i: number, patch: Partial<TentangContent[K][number]>) {
    setData((d) => ({ ...d, [k]: d[k].map((it, j) => (j === i ? { ...it, ...patch } : it)) }));
  }
  function addItem(k: ListKey) {
    setData((d) => ({ ...d, [k]: [...d[k], { ...EMPTY[k] }] }));
  }
  function removeItem(k: ListKey, i: number) {
    setData((d) => ({ ...d, [k]: d[k].filter((_, j) => j !== i) }));
  }
  function moveItem(k: ListKey, i: number, dir: -1 | 1) {
    setData((d) => {
      const list = [...d[k]];
      const j = i + dir;
      if (j < 0 || j >= list.length) return d;
      [list[i], list[j]] = [list[j], list[i]];
      return { ...d, [k]: list };
    });
  }

  const text = (k: keyof TentangContent, label: string, rows = 0) => (
    <Field label={label}>
      {rows ? (
        <textarea
          rows={rows}
          value={data[k] as string}
          onChange={(e) => set(k, e.target.value as never)}
          className={input}
        />
      ) : (
        <input value={data[k] as string} onChange={(e) => set(k, e.target.value as never)} className={input} />
      )}
    </Field>
  );

  const itemTools = (k: ListKey, i: number, len: number) => (
    <div className="flex gap-1">
      <button type="button" disabled={i === 0} onClick={() => moveItem(k, i, -1)} className={btnGhost} title="Naik">
        ↑
      </button>
      <button type="button" disabled={i === len - 1} onClick={() => moveItem(k, i, 1)} className={btnGhost} title="Turun">
        ↓
      </button>
      <button type="button" onClick={() => removeItem(k, i)} className={`${btnGhost} text-red-600`} title="Hapus">
        <AdminIcon d={ADMIN_ICON.trash} className="h-3.5 w-3.5" />
      </button>
    </div>
  );

  const section = (title: string, children: React.ReactNode, onAdd?: () => void) => (
    <section className={`${card} space-y-4 p-6`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#084734]">{title}</h2>
        {onAdd && (
          <button type="button" onClick={onAdd} className={btnGhost}>
            <AdminIcon d={ADMIN_ICON.plus} className="h-3.5 w-3.5" /> Tambah
          </button>
        )}
      </div>
      {children}
    </section>
  );

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="data" value={JSON.stringify(data)} />

      {section(
        "Bagian atas (hero)",
        <>
          {text("heroTitle", "Judul utama")}
          {text("heroSubtitle", "Subjudul", 3)}
          <div className="grid gap-4 sm:grid-cols-2">
            {text("heroImageUrl", "URL gambar")}
            {text("heroBadge", "Teks badge di gambar")}
          </div>
        </>,
      )}

      {section(
        "Misi & dedikasi",
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {text("missionTitle", "Judul bagian")}
            {text("missionSubtitle", "Subjudul bagian")}
          </div>
          {data.missions.map((m, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-stone-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-stone-500">Misi {i + 1}</span>
                {itemTools("missions", i, data.missions.length)}
              </div>
              <input
                placeholder="Judul"
                value={m.title}
                onChange={(e) => setItem("missions", i, { title: e.target.value })}
                className={input}
              />
              <textarea
                placeholder="Deskripsi"
                rows={2}
                value={m.description}
                onChange={(e) => setItem("missions", i, { description: e.target.value })}
                className={input}
              />
            </div>
          ))}
        </>,
        () => addItem("missions"),
      )}

      {section(
        "Perjalanan",
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {text("journeyTitle", "Judul bagian")}
            {text("journeySubtitle", "Subjudul bagian")}
          </div>
          {data.journey.map((j, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-stone-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-stone-500">Tahap {i + 1}</span>
                {itemTools("journey", i, data.journey.length)}
              </div>
              <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
                <input
                  placeholder="Tahun"
                  value={j.year}
                  onChange={(e) => setItem("journey", i, { year: e.target.value })}
                  className={input}
                />
                <input
                  placeholder="Judul"
                  value={j.title}
                  onChange={(e) => setItem("journey", i, { title: e.target.value })}
                  className={input}
                />
              </div>
              <textarea
                placeholder="Deskripsi"
                rows={2}
                value={j.description}
                onChange={(e) => setItem("journey", i, { description: e.target.value })}
                className={input}
              />
            </div>
          ))}
        </>,
        () => addItem("journey"),
      )}

      {section(
        "Profil anggota",
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {text("teamTitle", "Judul bagian")}
            {text("teamSubtitle", "Subjudul bagian")}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {data.team.map((t, i) => (
              <div key={i} className="space-y-3 rounded-xl border border-stone-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-stone-500">Anggota {i + 1}</span>
                  {itemTools("team", i, data.team.length)}
                </div>
                <input
                  placeholder="Nama"
                  value={t.name}
                  onChange={(e) => setItem("team", i, { name: e.target.value })}
                  className={input}
                />
                <input
                  placeholder="Jabatan"
                  value={t.role}
                  onChange={(e) => setItem("team", i, { role: e.target.value })}
                  className={input}
                />
                <input
                  placeholder="URL foto (opsional)"
                  value={t.photoUrl}
                  onChange={(e) => setItem("team", i, { photoUrl: e.target.value })}
                  className={input}
                />
              </div>
            ))}
          </div>
        </>,
        () => addItem("team"),
      )}

      <div className="sticky bottom-4 flex items-center gap-3 rounded-2xl border border-stone-200 bg-white/95 p-4 shadow-lg backdrop-blur">
        <div className="flex-1">
          <FormMessage state={state} />
        </div>
        <a href="/tentang" target="_blank" className={btnGhost}>
          <AdminIcon d={ADMIN_ICON.external} className="h-3.5 w-3.5" /> Lihat halaman
        </a>
        <button type="submit" disabled={pending || readOnly} className={btnPrimary}>
          {pending ? "Menyimpan…" : "Simpan perubahan"}
        </button>
      </div>
    </form>
  );
}
