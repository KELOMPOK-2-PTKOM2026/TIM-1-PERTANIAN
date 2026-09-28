import Link from "next/link";

const JENIS = ["herbisida", "insektisida", "fungisida", "akarisida"] as const;

// Stub Fase 2: katalog obat (nama dagang, bahan aktif, dosis, keamanan).
// TODO Fase 2: list dari modules/obat + filter jenis + search.
export default function ObatPage() {
  return (
    <div className="space-y-6 py-8">
      <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
        SEGERA HADIR · FASE 2
      </span>
      <h1 className="text-2xl font-extrabold">Info Obat-obatan Pertanian</h1>
      <p className="text-sm text-stone-600">
        Katalog obat dikelompokkan per jenis, lengkap dengan bahan aktif, dosis, target, keamanan,
        dan rekomendasi pakar.
      </p>
      <ul className="flex flex-wrap gap-3">
        {JENIS.map((j) => (
          <li key={j}>
            <Link
              href={`/obat/jenis/${j}`}
              className="rounded-lg border px-4 py-2 text-sm font-bold capitalize hover:underline"
            >
              {j}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
