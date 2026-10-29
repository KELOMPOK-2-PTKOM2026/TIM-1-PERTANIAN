import type { Consultation } from "@/modules/konsultasi/konsultasi.service";
import { formatTanggal } from "@/lib/format";

export function StatusBadge({ status }: { status: Consultation["status"] }) {
  return status === "ANSWERED" ? (
    <span className="rounded-full bg-tani-100 px-2.5 py-0.5 text-xs font-semibold text-tani-800">Dijawab</span>
  ) : (
    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">Menunggu</span>
  );
}

// Kartu Q&A: dipakai di riwayat, arsip, dan halaman jawab.
export default function ConsultationCard({
  item,
  showAsker = false,
  children,
}: {
  item: Consultation;
  showAsker?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <article className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
        <span className="rounded-full bg-stone-100 px-2.5 py-0.5 font-semibold text-stone-700">{item.topic}</span>
        <StatusBadge status={item.status} />
        <span>{formatTanggal(item.createdAt.toISOString())}</span>
        {showAsker && (
          <span>
            · {item.name}, {item.city}
          </span>
        )}
      </div>
      <p className="whitespace-pre-line text-sm text-stone-900">{item.question}</p>
      {item.answer && (
        <div className="rounded-xl bg-tani-50 p-4">
          <p className="mb-1 text-xs font-semibold text-tani-800">
            Jawaban {item.answeredBy ? `dari ${item.answeredBy}` : ""}
          </p>
          <p className="whitespace-pre-line text-sm text-stone-800">{item.answer}</p>
        </div>
      )}
      {children}
    </article>
  );
}
