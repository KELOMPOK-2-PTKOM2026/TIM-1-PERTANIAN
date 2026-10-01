import { beforeEach, describe, expect, it, vi } from "vitest";

// Prisma palsu: setiap model berisi vi.fn() agar service bisa diuji tanpa database.
const { prisma, getArticleBySlug } = vi.hoisted(() => {
  const model = () => ({
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  });
  return {
    prisma: {
      user: model(),
      consultation: model(),
      pesticide: model(),
      article: model(),
      price: model(),
    },
    getArticleBySlug: vi.fn(),
  };
});

vi.mock("@/lib/db", () => ({ prisma }));
vi.mock("@/lib/data", () => ({
  getArticleBySlug,
  getCommodities: vi.fn(async () => []),
  getMarkets: vi.fn(async () => []),
  getPrices: vi.fn(async () => []),
}));

import { authenticate, hashPassword, registerUser, verifyPassword } from "@/modules/auth/auth.service";
import {
  answerConsultation,
  createConsultation,
  listAnsweredArchive,
  listMyConsultations,
} from "@/modules/konsultasi/konsultasi.service";
import {
  createObat,
  deleteObat,
  getObatBySlug,
  listObat,
  slugifyObat,
} from "@/modules/obat/obat.service";
import { createArticle, deleteArticle, incrementViews, updateArticle } from "@/modules/artikel/artikel.service";
import { upsertHarga } from "@/modules/harga/harga.service";

beforeEach(() => {
  vi.clearAllMocks();
});

const registerInput = {
  name: "Petani Uji",
  email: "uji@tanimaju.id",
  password: "rahasia123",
  confirmPassword: "rahasia123",
  city: "",
  whatsapp: "",
};

describe("auth.service", () => {
  it("hashPassword + verifyPassword cocok, password salah ditolak", async () => {
    const hash = await hashPassword("rahasia123");
    expect(hash).not.toBe("rahasia123");
    expect(await verifyPassword("rahasia123", hash)).toBe(true);
    expect(await verifyPassword("salah12345", hash)).toBe(false);
  });

  it("registerUser menolak email yang sudah terdaftar (EMAIL_TAKEN)", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "u1" });
    await expect(registerUser(registerInput)).rejects.toMatchObject({ code: "EMAIL_TAKEN" });
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it("registerUser menyimpan hash (bukan password asli) dan string kosong jadi null", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockImplementation(async ({ data }) => ({ id: "u2", role: "PETANI", ...data }));

    const user = await registerUser(registerInput);

    const { data } = prisma.user.create.mock.calls[0][0];
    expect(data.passwordHash).not.toBe("rahasia123");
    expect(await verifyPassword("rahasia123", data.passwordHash)).toBe(true);
    expect(data.city).toBeNull();
    expect(data.whatsapp).toBeNull();
    expect(user).toEqual({ id: "u2", email: "uji@tanimaju.id", name: "Petani Uji", role: "PETANI" });
  });

  it("authenticate: sukses, email tidak ada, password salah", async () => {
    const passwordHash = await hashPassword("rahasia123");
    prisma.user.findUnique.mockResolvedValue({
      id: "u1",
      email: "uji@tanimaju.id",
      name: "Uji",
      role: "ADMIN",
      passwordHash,
    });
    expect(await authenticate("uji@tanimaju.id", "rahasia123")).toEqual({
      id: "u1",
      email: "uji@tanimaju.id",
      name: "Uji",
      role: "ADMIN",
    });
    expect(await authenticate("uji@tanimaju.id", "salah12345")).toBeNull();

    prisma.user.findUnique.mockResolvedValue(null);
    expect(await authenticate("tidakada@tanimaju.id", "rahasia123")).toBeNull();
  });
});

describe("konsultasi.service", () => {
  const row = {
    id: "k1",
    userId: "u1",
    topic: "HAMA",
    question: "Daun cabai keriting ke atas, apakah thrips?",
    answer: null,
    answeredById: null,
    status: "OPEN",
    createdAt: new Date("2026-09-01T00:00:00Z"),
  };

  it("createConsultation membuat status OPEN dan tanggal jadi ISO string", async () => {
    prisma.user.update.mockResolvedValue({});
    prisma.consultation.create.mockResolvedValue(row);

    const k = await createConsultation("u1", {
      name: "Uji",
      topic: "HAMA",
      question: row.question,
      city: "Magelang",
      whatsapp: "",
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { name: "Uji", city: "Magelang" },
    });
    expect(prisma.consultation.create.mock.calls[0][0].data.status).toBe("OPEN");
    expect(k.createdAt).toBe("2026-09-01T00:00:00.000Z");
  });

  it("createConsultation tetap jalan walau update profil gagal", async () => {
    prisma.user.update.mockRejectedValue(new Error("user mock"));
    prisma.consultation.create.mockResolvedValue(row);
    await expect(
      createConsultation("u1", { name: "Uji", topic: "HAMA", question: row.question }),
    ).resolves.toMatchObject({ id: "k1" });
  });

  it("listMyConsultations memfilter userId", async () => {
    prisma.consultation.findMany.mockResolvedValue([row]);
    const list = await listMyConsultations("u1");
    expect(prisma.consultation.findMany.mock.calls[0][0].where).toEqual({ userId: "u1" });
    expect(list).toHaveLength(1);
  });

  it("listAnsweredArchive membatasi limit ke rentang 1..200", async () => {
    prisma.consultation.findMany.mockResolvedValue([]);
    await listAnsweredArchive(9999);
    await listAnsweredArchive(0);
    expect(prisma.consultation.findMany.mock.calls[0][0].take).toBe(200);
    expect(prisma.consultation.findMany.mock.calls[1][0].take).toBe(1);
    expect(prisma.consultation.findMany.mock.calls[0][0].where).toEqual({ status: "ANSWERED" });
  });

  it("answerConsultation: NOT_FOUND bila tidak ada, ANSWERED bila ada", async () => {
    prisma.consultation.findUnique.mockResolvedValue(null);
    await expect(answerConsultation("x", "p1", "jawaban")).rejects.toMatchObject({ code: "NOT_FOUND" });

    prisma.consultation.findUnique.mockResolvedValue(row);
    prisma.consultation.update.mockResolvedValue({ ...row, status: "ANSWERED", answer: "jawaban", answeredById: "p1" });
    const k = await answerConsultation("k1", "p1", "jawaban");
    expect(prisma.consultation.update.mock.calls[0][0].data).toEqual({
      answer: "jawaban",
      answeredById: "p1",
      status: "ANSWERED",
    });
    expect(k.status).toBe("ANSWERED");
  });
});

describe("obat.service", () => {
  const obat = {
    id: "o1",
    slug: "abacel-18-ec",
    name: "Abacel 18 EC",
    type: "INSEKTISIDA" as const,
    bahanAktif: "Abamektin",
    target: ["thrips"],
    tanamanCocok: ["Cabai"],
    dosis: "1 ml/l",
    caraPakai: "Semprot sore hari.",
    keamanan: "Gunakan APD lengkap.",
    isPublished: true,
  };

  it("slugifyObat menghapus aksen dan simbol", () => {
    expect(slugifyObat("Décis 25 EC (Baru)!")).toBe("decis-25-ec-baru");
  });

  it("listObat membangun filter jenis + pencarian + published", async () => {
    prisma.pesticide.findMany.mockResolvedValue([obat]);
    await listObat({ jenis: "INSEKTISIDA", q: "aba", publishedOnly: true });
    const { where } = prisma.pesticide.findMany.mock.calls[0][0];
    expect(where.isPublished).toBe(true);
    expect(where.type).toBe("INSEKTISIDA");
    expect(where.OR).toHaveLength(2);
  });

  it("getObatBySlug menyembunyikan obat belum terbit kecuali diminta", async () => {
    prisma.pesticide.findUnique.mockResolvedValue({ ...obat, isPublished: false });
    await expect(getObatBySlug("abacel-18-ec")).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(getObatBySlug("abacel-18-ec", true)).resolves.toMatchObject({ id: "o1" });
  });

  it("createObat membuat slug otomatis dan memetakan error ke SLUG_TAKEN", async () => {
    prisma.pesticide.create.mockResolvedValue(obat);
    const { id: _id, slug: _slug, ...input } = obat;
    void _id;
    void _slug;
    await createObat(input, "admin1");
    expect(prisma.pesticide.create.mock.calls[0][0].data).toMatchObject({
      slug: "abacel-18-ec",
      createdById: "admin1",
    });

    prisma.pesticide.create.mockRejectedValue(new Error("Unique constraint"));
    await expect(createObat(input)).rejects.toMatchObject({ code: "SLUG_TAKEN" });
  });

  it("deleteObat: NOT_FOUND bila tidak ada", async () => {
    prisma.pesticide.findUnique.mockResolvedValue(null);
    await expect(deleteObat("x")).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(prisma.pesticide.delete).not.toHaveBeenCalled();
  });
});

describe("artikel.service", () => {
  const input = {
    title: "Cara Mengatasi Thrips Cabai",
    excerpt: "Ringkasan artikel yang cukup panjang.",
    contentMd: "x".repeat(60),
    coverUrl: "",
    category: "SOLUSI" as const,
    tags: ["cabai"],
    publishedAt: "2026-09-01",
  };

  it("createArticle menolak slug yang sudah dipakai", async () => {
    getArticleBySlug.mockResolvedValue({ slug: "cara-mengatasi-thrips-cabai" });
    await expect(createArticle(input)).rejects.toMatchObject({ code: "SLUG_TAKEN" });
  });

  it("createArticle: slug otomatis, coverUrl kosong jadi null, tanggal diparse", async () => {
    getArticleBySlug.mockResolvedValue(null);
    prisma.article.create.mockResolvedValue({});
    await createArticle(input);
    const { data } = prisma.article.create.mock.calls[0][0];
    expect(data.slug).toBe("cara-mengatasi-thrips-cabai");
    expect(data.coverUrl).toBeNull();
    expect(data.publishedAt).toBeInstanceOf(Date);
  });

  it("updateArticle hanya mengirim field yang diisi", async () => {
    prisma.article.findUnique.mockResolvedValue({ slug: "a" });
    prisma.article.update.mockResolvedValue({});
    await updateArticle("a", { title: "Judul baru yang panjang" });
    expect(prisma.article.update.mock.calls[0][0].data).toEqual({ title: "Judul baru yang panjang" });
  });

  it("deleteArticle: NOT_FOUND bila tidak ada", async () => {
    prisma.article.findUnique.mockResolvedValue(null);
    await expect(deleteArticle("x")).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("incrementViews tidak melempar error walau update gagal", async () => {
    prisma.article.update.mockRejectedValue(new Error("slug mock"));
    await expect(incrementViews("x")).resolves.toBeUndefined();
  });
});

describe("harga.service upsertHarga", () => {
  const input = { commodityId: "c1", marketId: "m1", price: 45000, date: "2026-09-24" };

  it("update bila harga tanggal itu sudah ada", async () => {
    prisma.price.findFirst.mockResolvedValue({ id: "p1" });
    await upsertHarga(input);
    expect(prisma.price.update).toHaveBeenCalledWith({ where: { id: "p1" }, data: { price: 45000 } });
    expect(prisma.price.create).not.toHaveBeenCalled();
  });

  it("create bila belum ada", async () => {
    prisma.price.findFirst.mockResolvedValue(null);
    await upsertHarga(input);
    expect(prisma.price.create.mock.calls[0][0].data).toMatchObject({ commodityId: "c1", price: 45000 });
  });
});
