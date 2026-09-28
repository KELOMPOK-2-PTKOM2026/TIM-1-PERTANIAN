import Link from "next/link";

// Stub Fase 2: pendaftaran akun (Petani, Pakar, Admin via OAuth Google).
// TODO Fase 2: alur register + penentuan role.
export default function RegisterPage() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-2xl font-extrabold">Daftar</h1>
      <p className="text-sm text-stone-600">
        Pendaftaran akun segera hadir di Fase 2. Setelah login kamu bisa bertanya di dashboard
        konsultasi.
      </p>
      <p>
        <Link href="/login" className="text-sm hover:underline">
          Sudah punya akun? Login
        </Link>
      </p>
    </div>
  );
}
