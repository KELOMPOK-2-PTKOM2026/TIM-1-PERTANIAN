import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/components/features/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white px-6 py-8 shadow-xl sm:px-10">
      <div className="flex items-center gap-3 border-b border-stone-200 pb-5">
        <Image src="/tanimajulogo.png" alt="" width={32} height={32} className="h-8 w-auto" />
        <span className="text-lg font-bold text-stone-900">Tanimaju</span>
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-tani-600">
        Pendaftaran Akun
      </p>
      <h1 className="mt-1 text-2xl font-bold text-stone-900">Daftar Akun Baru</h1>
      <p className="mt-1 text-sm text-stone-500">
        Mulai langkah cerdas bertani bersama ekosistem Tanimaju.
      </p>

      <div className="mt-6">
        <RegisterForm />
      </div>

      <p className="mt-6 text-center text-sm text-stone-600">
        Sudah memiliki akun Tanimaju?{" "}
        <Link href="/login" className="font-semibold text-stone-900 hover:underline">
          Masuk Sekarang ›
        </Link>
      </p>
    </div>
  );
}
