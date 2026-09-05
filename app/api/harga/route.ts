import { NextResponse } from "next/server";

// Stub API Fase 2 (F-P2-05):
// GET /api/harga?komoditas&pasar&from&to -> [{date,price,commodity,market}], max 2000, cache 60s.
// TODO Fase 2: panggil modules/harga/harga.service.ts + validasi query.
export async function GET() {
  return NextResponse.json([], {
    headers: { "Cache-Control": "public, max-age=60" },
  });
}
