import { Pagination } from "@/components/features/admin/ui";
import ConsultationCard from "@/components/features/konsultasi/ConsultationCard";
import { fieldClass } from "@/components/features/konsultasi/styles";
import { pageParams } from "@/modules/admin/admin.shared";
import { listAnswered } from "@/modules/konsultasi/konsultasi.service";

type SP = { q?: string; page?: string; per?: string };

// Arsip Q&A yang sudah dijawab pakar (read-only).
export default async function ArsipKonsultasiPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const { page, per, skip } = pageParams(sp, 10);
  const { items, total } = await listAnswered({ q: sp.q, skip, take: per });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Arsip Konsultasi</h1>
        <p className="mt-1 text-sm text-stone-600">Tanya-jawab yang sudah dijawab pakar.</p>
      </div>

      <form className="flex gap-2">
        <input name="q" defaultValue={sp.q} placeholder="Cari pertanyaan, jawaban, atau topik…" className={fieldClass} />
        <button type="submit" className="rounded-full bg-brand-400 px-5 text-sm font-semibold text-brand-950 hover:bg-brand-300">
          Cari
        </button>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-stone-500">Belum ada tanya-jawab{sp.q ? " yang cocok" : ""}.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <ConsultationCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <Pagination basePath="/dashboard/konsultasi/arsip" params={sp} page={page} per={per} total={total} noun="Q&A" />
    </div>
  );
}
