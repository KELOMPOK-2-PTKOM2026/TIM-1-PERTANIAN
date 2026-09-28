// Logika murni middleware / proxy (Next.js 16: proxy.ts).
// Dipisah dari NextResponse agar bisa di-unittest tanpa server.
export type UserRole = "ADMIN" | "PAKAR" | "PETANI";

export type GuardDecision =
  | { action: "next" }
  | { action: "redirect"; to: string };

export function decideAuthRedirect(
  pathname: string,
  search: string,
  role?: UserRole | string | null,
): GuardDecision {
  const fullPath = pathname + (search ?? "");

  // 1. Halaman auth selalu lolos dari loop: belum login -> next,
  //    sudah login -> lempar ke /dashboard.
  if (pathname === "/login" || pathname === "/register") {
    if (!role) return { action: "next" };
    return { action: "redirect", to: "/dashboard" };
  }

  // 2. Belum login -> ke /login (bawa callbackUrl agar balik lagi setelah login).
  if (!role) {
    return { action: "redirect", to: `/login?callbackUrl=${encodeURIComponent(fullPath)}` };
  }

  // 3. /admin wajib ADMIN, selain itu -> /dashboard.
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return { action: "redirect", to: "/dashboard" };
  }

  // 4. /dashboard boleh semua role yang sudah login.
  return { action: "next" };
}

// Cegah open-redirect: hanya izinkan path internal "/...".
export function getSafeCallbackUrl(value: unknown): string {
  const url = typeof value === "string" ? value : "";
  return url.startsWith("/") && !url.startsWith("//") ? url : "/dashboard";
}
