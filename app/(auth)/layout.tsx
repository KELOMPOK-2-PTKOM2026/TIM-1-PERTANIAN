// Layout auth polos (tanpa Navbar): login + register.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-stone-100 px-4 py-12">
      <div className="w-full max-w-4xl">{children}</div>
    </main>
  );
}
