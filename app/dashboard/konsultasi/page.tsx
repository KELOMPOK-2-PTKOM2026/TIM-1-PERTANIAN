// Stub Fase 2: form konsultasi (Nama, Kota, WA, Topik, Pertanyaan min 20 char)
// + riwayat milik sendiri (status OPEN|ANSWERED).
// TODO Fase 2: Server Action + Zod di modules/konsultasi.
export default function KonsultasiPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Konsultasi Tani</h1>
      <p className="text-sm text-stone-600">
        Form tanya + riwayat pertanyaanmu akan tampil di sini setelah login (Fase 2, OAuth
        Google).
      </p>
    </div>
  );
}
