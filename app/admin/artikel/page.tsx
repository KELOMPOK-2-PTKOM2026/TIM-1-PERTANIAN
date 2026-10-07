import Link from "next/link";
import ActionButton from "@/components/features/admin/ActionButton";
import {
  ADMIN_ICON,
  AdminIcon,
  Badge,
  type BadgeTone,
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
import { formatTanggal } from "@/lib/format";
import { CATEGORY_LABEL, type ArticleCategory } from "@/lib/mock";
import { pageParams } from "@/modules/admin/admin.shared";
import { deleteArticleAction, togglePublishAction } from "@/modules/artikel/artikel.actions";
import { articleStats, listArticles } from "@/modules/artikel/artikel.service";

// Warna penanda per kategori supaya card mudah dibedakan.
const CATEGORY_TONE: Record<keyof typeof CATEGORY_LABEL, BadgeTone> = {
  PENGETAHUAN: "blue",
  KIAT: "green",
  SOLUSI: "red",
  INSPIRASI: "amber",
};

type SP = { q?: string; category?: string; status?: string; page?: string; per?: string };

export default async function AdminArtikelPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const { page, per, skip } = pageParams(sp);
  const category = sp.category && sp.category in CATEGORY_LABEL ? (sp.category as ArticleCategory) : undefined;
  const status = sp.status === "draft" || sp.status === "publish" ? sp.status : undefined;
  const mock = isMockMode();

  const [stats, { items, total }] = await Promise.all([
    articleStats(),
    listArticles({ q: sp.q, category, status, skip, take: per }),
  ]);

  return (
    <>
      {mock && <MockBanner />}
      <PageHeader
        title="Manajemen Artikel"
        description="Kelola wawasan teknis, publikasi riset, dan panduan praktis budidaya untuk petani Nusantara."
        action={
          <Link href="/admin/artikel/baru" className={btnLime}>
            <AdminIcon d={ADMIN_ICON.plus} /> Artikel baru
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total publikasi" value={stats.published} unit="Artikel" note={`+${stats.newThisMonth} artikel baru bulan ini`} />
        <StatCard label="Tayangan artikel" value={stats.views.toLocaleString("id-ID")} unit="kali" note="Akumulasi semua artikel" />
        <StatCard label="Draft" value={stats.drafts} unit="Menunggu" note="Belum diterbitkan" />
      </div>

      <form className={`${card} grid gap-3 p-4 sm:grid-cols-[1fr_180px_150px_auto]`}>
        <input name="q" defaultValue={sp.q} placeholder="Cari judul artikel…" className={input} />
        <select name="category" defaultValue={category ?? ""} className={input}>
          <option value="">Semua kategori</option>
          {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status ?? ""} className={input}>
          <option value="">Semua status</option>
          <option value="publish">Terbit</option>
          <option value="draft">Draft</option>
        </select>
        <input type="hidden" name="per" value={per} />
        <button className={btnGhost}>
          <AdminIcon d={ADMIN_ICON.search} /> Terapkan
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState>Belum ada artikel yang cocok.</EmptyState>
      ) : (
        <ul className="space-y-4">
          {items.map((a) => (
            <li key={a.id} className={`${card} flex flex-col gap-4 border-l-4 p-4 sm:flex-row ${a.publishedAt ? "border-l-emerald-500" : "border-l-amber-400"}`}>
              <div className="aspect-[3/2] w-full shrink-0 overflow-hidden rounded-xl bg-tani-100 sm:w-56">
                {a.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- URL cover bebas (bukan domain tetap)
                  <img src={a.coverUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-tani-400">
                    <AdminIcon d={ADMIN_ICON.doc} className="h-10 w-10" />
                  </div>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                  <Badge tone={CATEGORY_TONE[a.category]}>{CATEGORY_LABEL[a.category]}</Badge>
                  {a.publishedAt ? <Badge dot>Terbit</Badge> : <Badge tone="amber" dot>Draft</Badge>}
                  <span className="flex items-center gap-1">
                    <AdminIcon d={ADMIN_ICON.calendar} className="h-3.5 w-3.5" />
                    {formatTanggal(a.publishedAt ?? a.createdAt)}
                  </span>
                  <span className="font-semibold text-stone-700">{a.author || "Tim Tanimaju"}</span>
                  <span className="flex items-center gap-1">
                    <AdminIcon d={ADMIN_ICON.eye} className="h-3.5 w-3.5" />
                    {a.views} tayang
                  </span>
                </div>
                <Link
                  href={`/admin/artikel/${a.id}/edit`}
                  className="mt-2 text-lg font-bold text-[#084734] hover:underline"
                >
                  {a.title}
                </Link>
                <p className="mt-1 line-clamp-2 text-sm text-stone-600">{a.excerpt}</p>
                {!mock && (
                  <div className="mt-auto flex flex-wrap gap-2 pt-3">
                    <Link href={`/admin/artikel/${a.id}/edit`} className={btnGhost}>
                      <AdminIcon d={ADMIN_ICON.edit} className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <ActionButton
                      action={togglePublishAction}
                      fields={{ id: a.id, publish: a.publishedAt ? "0" : "1" }}
                      className={btnGhost}
                    >
                      {a.publishedAt ? "Jadikan draft" : "Terbitkan"}
                    </ActionButton>
                    {a.publishedAt && (
                      <Link href={`/artikel/${a.slug}`} target="_blank" className={btnGhost}>
                        <AdminIcon d={ADMIN_ICON.external} className="h-3.5 w-3.5" /> Lihat
                      </Link>
                    )}
                    <ActionButton
                      action={deleteArticleAction}
                      fields={{ id: a.id }}
                      confirmText={`Hapus artikel "${a.title}"?`}
                      className={`${btnGhost} text-red-600`}
                    >
                      <AdminIcon d={ADMIN_ICON.trash} className="h-3.5 w-3.5" /> Hapus
                    </ActionButton>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Pagination basePath="/admin/artikel" params={sp} page={page} per={per} total={total} noun="artikel" />
    </>
  );
}
