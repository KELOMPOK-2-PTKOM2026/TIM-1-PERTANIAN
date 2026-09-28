import { describe, expect, it } from "vitest";
import { formatRupiah, formatTanggal } from "@/lib/format";

describe("formatRupiah", () => {
  it("memformat ribuan ala id-ID dengan prefix Rp", () => {
    expect(formatRupiah(45000)).toBe("Rp45.000");
    expect(formatRupiah(13500)).toBe("Rp13.500");
  });

  it("menangani nol", () => {
    expect(formatRupiah(0)).toBe("Rp0");
  });
});

describe("formatTanggal", () => {
  it("memformat yyyy-mm-dd ke bahasa Indonesia", () => {
    expect(formatTanggal("2026-09-24")).toContain("2026");
    expect(formatTanggal("2026-09-24")).toContain("Sep");
  });

  it("memformat ISO datetime", () => {
    const out = formatTanggal(new Date("2026-01-15T00:00:00Z").toISOString());
    expect(out).toContain("2026");
  });
});
