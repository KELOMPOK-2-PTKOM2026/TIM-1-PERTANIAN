import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/features/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl md:grid md:grid-cols-2">
      {/* Panel kiri: placeholder gradasi. Ganti dengan foto (mis. public/login-bg.jpg) + overlay hijau. */}
      <div className="hidden flex-col justify-between bg-gradient-to-br from-tani-800 to-tani-950 p-8 text-white md:flex">
        <Image src="/tanimajulogo.png" alt="TaniMaju" width={128} height={32} className="h-8 w-auto" />
        <div>
          <p className="text-3xl font-bold">Masuk Akun</p>
          <p className="mt-2 text-sm text-tani-100">
            Konsultasi pakar, info obat, dan harga pasar dalam satu tempat.
          </p>
        </div>
      </div>

      <div className="px-6 py-10 sm:px-10">
        <h1 className="text-2xl font-bold text-stone-900">Selamat Datang</h1>
        <p className="mt-1 text-sm text-stone-500">Masuk ke Ekosistem Pertanian Cerdas Anda.</p>

        <div className="mt-8">
          <LoginForm callbackUrl={callbackUrl} />
        </div>

        <hr className="my-8 border-stone-200" />
        <p className="text-center text-sm text-stone-600">
          Belum punya akun Tanimaju?{" "}
          <Link href="/register" className="font-semibold text-stone-900 hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
