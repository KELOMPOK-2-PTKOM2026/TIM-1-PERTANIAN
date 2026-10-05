import Link from "next/link";
import ActionButton from "@/components/features/admin/ActionButton";
import {
  ADMIN_ICON,
  AdminIcon,
  Badge,
  btnGhost,
  btnLime,
  card,
  EmptyState,
  input,
  MockBanner,
  PageHeader,
  Pagination,
  StatCard,
} from "@/components/features/admin/ui";
import { isMockMode } from "@/lib/data";
import { pageParams } from "@/modules/admin/admin.shared";
import { deletePesticideAction } from "@/modules/obat/obat.actions";
import { PESTICIDE_TYPE_LABEL, PESTICIDE_TYPES, type PesticideType } from "@/modules/obat/obat.schema";
import { listPesticides, pesticideCountByType } from "@/modules/obat/obat.service";

type SP = { q?: string; type?: string; page?: string; per?: string };

export default async function AdminObatPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const { page, per, skip } = pageParams(sp, 10);
  const type = PESTICIDE_TYPES.includes(sp.type as PesticideType) ? (sp.type as PesticideType) : undefined;
  const mock = isMockMode();

  const [counts, { items, total }] = await Promise.all([
    pesticideCountByType(),
    listPesticides({ q: sp.q, type, skip, take: per }),
  ]);

  return (
    <>
      {mock && <MockBanner />}
      <PageHeader
        title="Direktori Info Obat"
        description="Katalog obat pertanian resmi: bahan aktif, sasaran hama/penyakit, dan dosis anjuran."
        action={
          !mock && (
            <Link href="/admin/obat/baru" className={btnLime}>
              <AdminIcon d={ADMIN_ICON.plus} /> Obat baru
            </Link>
          )
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PESTICIDE_TYPES.map((t) => (
          <StatCard key={t} label={PESTICIDE_TYPE_LABEL[t]} value={counts[t]} unit="Produk" />
        ))}
      </div>

      <form className={`${card} grid gap-3 p-4 sm:grid-cols-[1fr_200px_auto]`}>
        <input name="q" defaultValue={sp.q} placeholder="Cari nama atau bahan aktif…" className={input} />
        <select name="type" defaultValue={type ?? ""} className={input}>
          <option value="">Semua jenis</option>
          {PESTICIDE_TYPES.map((t) => (
            <option key={t} value={t}>
              {PESTICIDE_TYPE_LABEL[t]}
            </option>
          ))}
        </select>
        <button className={btnGhost}>
          <AdminIcon d={ADMIN_ICON.search} /> Terapkan
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState>{mock ? "Katalog obat membutuhkan database." : "Belum ada obat yang cocok."}</EmptyState>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {items.map((o) => (
            <li key={o.id} className={`${card} flex flex-col p-5`}>
              <div className="flex items-start justify-between gap-2">
                <Badge>{PESTICIDE_TYPE_LABEL[o.type]}</Badge>
                {o.manufacturer && <span className="text-xs font-semibold text-tani-600">{o.manufacturer}</span>}
              </div>
              <h2 className="mt-2 text-lg font-bold text-[#084734]">{o.name}</h2>
              <p className="text-xs text-stone-500">Bahan aktif: {o.activeIngredient}</p>
              <p className="mt-2 line-clamp-2 text-sm text-stone-600">{o.targets}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-stone-100 pt-3">
                <span className="rounded-md bg-stone-100 px-2 py-1 text-xs font-semibold">Dosis: {o.dosage}</span>
                <span className="flex-1" />
                <Link href={`/admin/obat/${o.id}/edit`} className={btnGhost}>
                  <AdminIcon d={ADMIN_ICON.edit} className="h-3.5 w-3.5" /> Edit
                </Link>
                <ActionButton
                  action={deletePesticideAction}
                  fields={{ id: o.id }}
                  confirmText={`Hapus "${o.name}"?`}
                  className={`${btnGhost} text-red-600`}
                >
                  <AdminIcon d={ADMIN_ICON.trash} className="h-3.5 w-3.5" />
                </ActionButton>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Pagination basePath="/admin/obat" params={sp} page={page} per={per} total={total} noun="obat" />
    </>
  );
}
