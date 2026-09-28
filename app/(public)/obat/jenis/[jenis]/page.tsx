// Stub Fase 2: daftar obat per jenis (herbisida|insektisida|fungisida|akarisida).
// TODO Fase 2: validasi params + list dari modules/obat.
export default async function ObatJenisPage({
  params,
}: {
  params: Promise<{ jenis: string }>;
}) {
  const { jenis } = await params;
  return (
    <div className="space-y-4 py-8">
      <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
        SEGERA HADIR · FASE 2
      </span>
      <h1 className="text-2xl font-extrabold capitalize">Obat: {jenis}</h1>
      <p className="text-sm text-stone-600">
        Daftar obat jenis ini akan tampil di sini setelah modul Info Obat Fase 2 jadi.
      </p>
    </div>
  );
}
