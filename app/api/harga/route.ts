import { NextResponse } from "next/server";
import { AppError, toHttpStatus } from "@/lib/errors";
import { hargaQuerySchema } from "@/modules/harga/harga.schema";
import { getHarga } from "@/modules/harga/harga.service";

// GET /api/harga?komoditas&pasar&from&to -> [{date,price,commodity,market}], max 2000, cache 60s.
export async function GET(req: Request) {
  const params = Object.fromEntries(new URL(req.url).searchParams);
  const parsed = hargaQuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message, code: "VALIDATION" },
      { status: 400 },
    );
  }

  try {
    const rows = await getHarga(parsed.data);
    return NextResponse.json(rows, {
      headers: { "Cache-Control": "public, max-age=60" },
    });
  } catch (e) {
    if (e instanceof AppError) {
      return NextResponse.json({ error: e.message, code: e.code }, { status: toHttpStatus(e.code) });
    }
    return NextResponse.json({ error: "Gagal mengambil harga", code: "INTERNAL" }, { status: 500 });
  }
}
