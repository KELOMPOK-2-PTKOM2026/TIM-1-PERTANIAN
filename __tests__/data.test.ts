import { describe, expect, it, vi } from "vitest";

// Mock lib/db agar tidak butuh `prisma generate` / DATABASE_URL saat unittest.
// lib/data.ts akan jatuh ke MOCK_* bila prisma null.
vi.mock("@/lib/db", () => ({ prisma: null }));

import { getArticles, getPrices, isMockMode } from "@/lib/data";

describe("lib/data (mode mock tanpa DATABASE_URL)", () => {
  it("isMockMode true saat DATABASE_URL kosong", () => {
    expect(isMockMode()).toBe(true);
  });

  it("getArticles filter kategori + search", async () => {
    const solusi = await getArticles({ category: "SOLUSI" });
    expect(solusi.length).toBeGreaterThan(0);
    expect(solusi.every((a) => a.category === "SOLUSI")).toBe(true);

    const cari = await getArticles({ q: "thrips" });
    expect(cari.length).toBeGreaterThan(0);
    expect(cari[0].title.toLowerCase()).toContain("thrips");
  });

  it("getPrices filter komoditas+pasar dan urut tanggal asc", async () => {
    const rows = await getPrices({ commodityId: "c-rawit", marketId: "m-muntilan" });
    expect(rows.length).toBe(30); // 30 hari mock
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i].date >= rows[i - 1].date).toBe(true);
    }
  });

  it("getPrices filter tanggal from/to", async () => {
    const semua = await getPrices({ commodityId: "c-rawit", marketId: "m-muntilan" });
    const tengah = semua[10].date;
    const potong = await getPrices({
      commodityId: "c-rawit",
      marketId: "m-muntilan",
      from: tengah,
      to: tengah,
    });
    expect(potong.length).toBe(1);
    expect(potong[0].date).toBe(tengah);
  });
});
