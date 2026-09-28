import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { decideAuthRedirect } from "@/lib/route-guard";

// Middleware Next.js 16 (file proxy.ts pengganti middleware.ts).
// Guard optimistis: guard utama tetap di layout via modules/auth/auth.guard.ts.
export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const decision = decideAuthRedirect(pathname, search, req.auth?.user?.role);

  if (decision.action === "redirect") {
    // decision.to sudah berupa path internal (termasuk /login?callbackUrl=...).
    return NextResponse.redirect(new URL(decision.to, req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
