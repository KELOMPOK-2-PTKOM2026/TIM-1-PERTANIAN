import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({ prisma: null }));

import { toHttpStatus } from "@/lib/errors";
import { hargaQuerySchema, hargaUpsertSchema } from "@/modules/harga/harga.schema";
import { getHarga } from "@/modules/harga/harga.service";
import { konsultasiSchema, jawabanSchema } from "@/modules/konsultasi/konsultasi.schema";
import {
  answerConsultation,
  createConsultation,
  listAnsweredArchive,
} from "@/modules/konsultasi/konsultasi.service";
import { obatInputSchema } from "@/modules/obat/obat.schema";
import { listObat } from "@/modules/obat/obat.service";
import { slugify } from "@/modules/artikel/artikel.service";
import { artikelInputSchema } from "@/modules/artikel/artikel.schema";

describe("toHttpStatus", () => {
  it("mapping kode -> status", () => {
    expect(toHttpStatus("VALIDATION")).toBe(400);
    expect(toHttpStatus("UNAUTHORIZED")).toBe(401);
    expect(toHttpStatus("FORBIDDEN")).toBe(403);
    expect(toHttpStatus("NOT_FOUND")).toBe(404);
    expect(toHttpStatus("EMAIL_TAKEN")).toBe(409);
    expect(toHttpStatus("SLUG_TAKEN")).toBe(409);
    expect(toHttpStatus("DB_UNAVAILABLE")).toBe(503);
    expect(toHttpStatus("ANEH")).toBe(500);
  });
});

describe("harga schema + service (mock)", () => {
  it("menerima query kosong dan menolak tanggal invalid", () => {
    expect(hargaQuerySchema.safeParse({}).success).toBe(true);
    expect(hargaQuerySchema.safeParse({ from: "24-09-2026" }).success).toBe(false);
    expect(hargaQuerySchema.safeParse({ from: "2026-02-01", to: "2026-01-01" }).success).toBe(false);
  });

  it("upsert menolak harga negatif", () => {
    expect(
      hargaUpsertSchema.safeParse({ commodityId: "c", marketId: "m", price: -100, date: "2026-09-24" })
        .success,
    ).toBe(false);
  });

  it("getHarga by nama mengembalikan 30 titik terurut", async () => {
    const rows = await getHarga({ komoditas: "Cabai Rawit", pasar: "Pasar Muntilan" });
    expect(rows.length).toBe(30);
    expect(rows[0].commodity).toBe("Cabai Rawit");
    for (let i = 1; i < rows.length; i++) expect(rows[i].date >= rows[i - 1].date).toBe(true);
  });
});

describe("konsultasi schema + service", () => {
  it("menolak pertanyaan < 20 karakter", () => {
    const r = konsultasiSchema.safeParse({
      name: "Tani",
      topic: "HAMA",
      question: "terlalu pendek",
    });
    expect(r.success).toBe(false);
    expect(jawabanSchema.safeParse({ answer: "ok" }).success).toBe(false);
  });

  it("tanpa DB lempar DB_UNAVAILABLE", async () => {
    await expect(
      createConsultation("u1", {
        name: "Tani",
        topic: "HAMA",
        question: "Daun cabai keriting ke atas, apakah ini gejala thrips?",
      }),
    ).rejects.toMatchObject({ code: "DB_UNAVAILABLE" });
    await expect(listAnsweredArchive()).rejects.toMatchObject({ code: "DB_UNAVAILABLE" });
    await expect(answerConsultation("x", "pakar", "jawaban panjang...")).rejects.toMatchObject({
      code: "DB_UNAVAILABLE",
    });
  });
});

describe("obat + artikel", () => {
  it("obat menolak jenis di luar enum", () => {
    expect(
      obatInputSchema.safeParse({
        name: "Obat X",
        type: "VITAMIN",
        bahanAktif: "Z",
        target: ["ulat"],
        tanamanCocok: ["Cabai"],
        dosis: "1 ml/l",
        caraPakai: "Semprot merata sore hari.",
        keamanan: "Gunakan APD lengkap selalu.",
      }).success,
    ).toBe(false);
  });

  it("tanpa DB listObat lempar DB_UNAVAILABLE", async () => {
    await expect(listObat()).rejects.toMatchObject({ code: "DB_UNAVAILABLE" });
  });

  it("slugify konsisten", () => {
    expect(slugify("Cara Mengatasi Daun Cabai!")).toBe("cara-mengatasi-daun-cabai");
  });

  it("artikel menolak konten terlalu pendek", () => {
    expect(
      artikelInputSchema.safeParse({
        title: "Judul cukup panjang di sini",
        excerpt: "Excerpt yang cukup panjang minimal dua puluh karakter.",
        contentMd: "pendek",
        category: "SOLUSI",
        tags: [],
      }).success,
    ).toBe(false);
  });
});
