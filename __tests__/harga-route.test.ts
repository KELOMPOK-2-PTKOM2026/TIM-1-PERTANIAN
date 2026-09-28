import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({ prisma: null }));

import { GET } from "@/app/api/harga/route";

function req(url: string) {
  return new Request(url);
}

describe("GET /api/harga (F-P2-05)", () => {
  it("tanpa query -> 200 + array + header cache 60s", async () => {
    const res = await GET(req("http://localhost/api/harga"));
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("public, max-age=60");
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toMatchObject({
      date: expect.any(String),
      price: expect.any(Number),
      commodity: expect.any(String),
      market: expect.any(String),
    });
  });

  it("filter by nama + rentang tanggal", async () => {
    const res = await GET(
      req("http://localhost/api/harga?komoditas=Cabai%20Rawit&pasar=Pasar%20Muntilan&from=2000-01-01&to=2100-01-01"),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.length).toBe(30);
    expect(body.every((r: { commodity: string }) => r.commodity === "Cabai Rawit")).toBe(true);
  });

  it("komoditas tidak ada -> 404 NOT_FOUND", async () => {
    const res = await GET(req("http://localhost/api/harga?komoditas=tidak-ada"));
    expect(res.status).toBe(404);
    expect(await res.json()).toMatchObject({ code: "NOT_FOUND" });
  });

  it("from > to -> 400 VALIDATION", async () => {
    const res = await GET(req("http://localhost/api/harga?from=2026-02-01&to=2026-01-01"));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ code: "VALIDATION" });
  });
});
