import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { decideAuthRedirect } from "@/lib/route-guard";

// Middleware Next.js 16 (file proxy.ts pengganti middleware.ts).
// Guard optimistis di edge: guard utama tetap di layout via modules/auth/auth.guard.ts.
export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const role = req.auth?.user?.role;

  const decision = decideAuthRedirect(pathname, search, role);

  if (decision.action === "redirect") {
    // Untuk kasus belum login, decision.to sudah berisi /login?callbackUrl=...
    // Untuk kasus lain, buat URL absolut dari path tujuan.
    if (decision.to.startsWith("/login?")) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(url);
    }
    return NextResponse.redirect(new URL(decision.to, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
