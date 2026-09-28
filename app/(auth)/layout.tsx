// Layout auth polos (tanpa Navbar): login + register.
// TODO Fase 2: Auth.js v5 + OAuth Google.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
      {children}
    </main>
  );
}
