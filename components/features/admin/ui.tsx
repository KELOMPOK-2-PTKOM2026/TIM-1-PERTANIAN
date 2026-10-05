import Link from "next/link";

// Elemen UI admin bersama (server-safe).
export const ADMIN_ICON = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  doc: "M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h8",
  trend: "M3 17l6-6 4 4 8-8M15 7h6v6",
  flask: "M9 2h6M10 2v6L4 20h16L14 8V2M7 14h10",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 4V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 10h.1a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1z",
  external: "M14 3h7v7M21 3l-9 9M19 14v7H3V5h7",
  logout: "M9 21H4V3h5M16 17l5-5-5-5M21 12H9",
  menu: "M3 6h18M3 12h18M3 18h18",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  calendar: "M3 5h18v16H3zM3 10h18M8 3v4M16 3v4",
  plus: "M12 5v14M5 12h14",
  edit: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3",
  info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-5M12 8h.01",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5",
};

export function AdminIcon({ d, className = "h-4 w-4" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const card = "rounded-2xl border border-stone-200/70 bg-white shadow-sm";
export const input =
  "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-tani-400 focus:ring-2 focus:ring-tani-200";
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#084734] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0b5c43] disabled:opacity-60";
export const btnLime =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#CDEF7A] px-4 py-2 text-sm font-semibold text-[#084734] hover:brightness-95";
export const btnGhost =
  "inline-flex items-center justify-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={`${card} flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8`}>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#084734] md:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-xl text-sm text-stone-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  unit,
  note,
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  note?: React.ReactNode;
}) {
  return (
    <div className={`${card} p-5`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-[#084734]">
        {value} {unit && <span className="text-base font-medium text-stone-600">{unit}</span>}
      </p>
      {note && <p className="mt-1 text-xs font-semibold text-tani-600">{note}</p>}
    </div>
  );
}

export function MockBanner() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <strong>Mode mock</strong> — data hanya contoh dan tidak bisa diubah. Isi <code>DATABASE_URL</code> untuk
      mengaktifkan CMS.
    </div>
  );
}

export function Badge({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "gray" | "amber" }) {
  const cls = {
    green: "bg-[#CDEF7A]/70 text-[#084734]",
    gray: "bg-stone-100 text-stone-700",
    amber: "bg-amber-100 text-amber-800",
  }[tone];
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{children}</span>;
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-stone-700">{label}</span>
      {children}
      {hint && <span className="block text-xs text-stone-500">{hint}</span>}
    </label>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className={`${card} p-10 text-center text-sm text-stone-500`}>{children}</div>;
}

// Pagination berbasis query string (?page=&per=), filter lain dipertahankan.
export function Pagination({
  basePath,
  params,
  page,
  per,
  total,
  noun,
}: {
  basePath: string;
  params: Record<string, string | undefined>;
  page: number;
  per: number;
  total: number;
  noun: string;
}) {
  const pages = Math.max(1, Math.ceil(total / per));
  const href = (p: number, n = per) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v && k !== "page" && k !== "per") qs.set(k, v);
    qs.set("page", String(p));
    qs.set("per", String(n));
    return `${basePath}?${qs}`;
  };
  const nums = [...new Set([1, page - 1, page, page + 1, pages])].filter((n) => n >= 1 && n <= pages);

  return (
    <div className={`${card} flex flex-col gap-3 p-4 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between`}>
      <div className="flex flex-wrap items-center gap-2">
        Menampilkan
        {[5, 10, 20].map((n) => (
          <Link
            key={n}
            href={href(1, n)}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              n === per ? "bg-[#084734] text-white" : "bg-stone-100 hover:bg-stone-200"
            }`}
          >
            {n}
          </Link>
        ))}
        per halaman dari {total} {noun}
      </div>
      <div className="flex items-center gap-1">
        {page > 1 && (
          <Link href={href(page - 1)} className={btnGhost}>
            ‹ Sebelumnya
          </Link>
        )}
        {nums.map((n, i) => (
          <span key={n} className="flex items-center">
            {i > 0 && n - nums[i - 1] > 1 && <span className="px-1">…</span>}
            <Link
              href={href(n)}
              className={`grid h-8 w-8 place-items-center rounded-full font-semibold ${
                n === page ? "bg-[#CDEF7A] text-[#084734]" : "hover:bg-stone-100"
              }`}
            >
              {n}
            </Link>
          </span>
        ))}
        {page < pages && (
          <Link href={href(page + 1)} className={btnGhost}>
            Selanjutnya ›
          </Link>
        )}
      </div>
    </div>
  );
}
