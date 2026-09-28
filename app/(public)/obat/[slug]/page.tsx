// Stub Fase 2: detail obat (dosis, cara pakai, APD/PHI, box rekomendasi).
// TODO Fase 2: fetch dari modules/obat, 404 bila slug tidak ada / isPublished=false.
export default async function ObatDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="space-y-4 py-8">
      <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
        SEGERA HADIR · FASE 2
      </span>
      <h1 className="text-2xl font-extrabold">{slug}</h1>
      <p className="text-sm text-stone-600">
        Detail dosis, cara pakai, keamanan, dan rekomendasi pakar akan tampil di sini.
      </p>
    </div>
  );
}
