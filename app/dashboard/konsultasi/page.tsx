// Stub Fase 2: form konsultasi (Nama, Kota, WA, Topik, Pertanyaan min 20 char)
// + riwayat milik sendiri (status OPEN|ANSWERED).
// TODO Fase 2: Server Action + Zod di modules/konsultasi.
export default async function KonsultasiPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { welcome } = await searchParams;

  return (
    <div className="space-y-4">
      {welcome === "1" && (
        <div role="status" className="rounded-2xl border border-tani-200 bg-tani-50 p-4 text-sm text-tani-800">
          <p className="font-semibold">Akun berhasil dibuat. Selamat datang!</p>
        </div>
      )}
      <h1 className="text-2xl font-extrabold">Konsultasi Tani</h1>
      <p className="text-sm text-stone-600">
        Form tanya + riwayat pertanyaanmu akan tampil di sini setelah login (Fase 2, OAuth
        Google).
      </p>
    </div>
  );
}
