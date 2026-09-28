import Link from "next/link";
import LoginForm from "@/components/features/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="space-y-4 text-center">
      <h1 className="text-2xl font-extrabold">Login</h1>
      <LoginForm callbackUrl={callbackUrl} />
      <p>
        <Link href="/register" className="text-sm hover:underline">
          Belum punya akun? Daftar
        </Link>
      </p>
    </div>
  );
}
