import Link from "next/link";

// Stub Fase 2: login via OAuth Google (Auth.js v5).
// TODO Fase 2: signIn("google") + callback ke /dashboard.
export default function LoginPage() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-2xl font-extrabold">Login</h1>
      <p className="text-sm text-stone-600">
        Login dengan akun Google untuk mengakses Konsultasi dan halaman Admin. Segera hadir di
        Fase 2.
      </p>
      <p>
        <Link href="/register" className="text-sm hover:underline">
          Belum punya akun? Daftar
        </Link>
      </p>
    </div>
  );
}
