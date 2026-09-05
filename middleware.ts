import { NextResponse } from "next/server";

// Guard Fase 2 (stub): /dashboard wajib login, /admin wajib ADMIN.
// TODO Fase 2: isi dengan check session Auth.js + OAuth Google.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
