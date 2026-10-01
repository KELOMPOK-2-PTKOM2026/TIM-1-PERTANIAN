import { beforeEach, describe, expect, it, vi } from "vitest";

// redirect() Next.js melempar error; tiru agar alur guard bisa diuji.
const { auth, signIn, signOut, redirect, revalidatePath, svc } = vi.hoisted(() => ({
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  redirect: vi.fn((to: string) => {
    throw new Error(`REDIRECT:${to}`);
  }),
  revalidatePath: vi.fn(),
  svc: {
    createConsultation: vi.fn(),
    answerConsultation: vi.fn(),
    registerUser: vi.fn(),
  },
}));

vi.mock("@/lib/auth", () => ({ auth, signIn, signOut }));
vi.mock("next-auth", () => ({
  AuthError: class AuthError extends Error {
    cause?: { err?: unknown };
  },
}));
vi.mock("next/navigation", () => ({ redirect }));
vi.mock("next/cache", () => ({ revalidatePath }));
vi.mock("@/modules/konsultasi/konsultasi.service", () => ({
  createConsultation: svc.createConsultation,
  answerConsultation: svc.answerConsultation,
}));
vi.mock("@/modules/auth/auth.service", () => ({ registerUser: svc.registerUser }));

import { AppError } from "@/lib/errors";
import { getCurrentUser, requireRole, requireUser } from "@/modules/auth/auth.guard";
import {
  answerConsultationAction,
  createConsultationAction,
} from "@/modules/konsultasi/konsultasi.actions";
import { loginAction, registerAction } from "@/modules/auth/auth.actions";

const petani = { id: "u1", email: "p@tanimaju.id", name: "Petani", role: "PETANI" };
const pakar = { id: "p1", email: "k@tanimaju.id", name: "Pakar", role: "PAKAR" };

function form(data: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(data)) f.set(k, v);
  return f;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("auth.guard", () => {
  it("getCurrentUser: null bila belum login", async () => {
    auth.mockResolvedValue(null);
    expect(await getCurrentUser()).toBeNull();
  });

  it("requireUser redirect ke /login bila belum login", async () => {
    auth.mockResolvedValue(null);
    await expect(requireUser()).rejects.toThrow("REDIRECT:/login");
  });

  it("requireRole: lolos untuk role yang diizinkan, redirect /dashboard bila tidak", async () => {
    auth.mockResolvedValue({ user: pakar });
    await expect(requireRole("PAKAR", "ADMIN")).resolves.toEqual(pakar);

    auth.mockResolvedValue({ user: petani });
    await expect(requireRole("ADMIN")).rejects.toThrow("REDIRECT:/dashboard");
  });
});

describe("konsultasi.actions", () => {
  const valid = {
    name: "Petani",
    topic: "HAMA",
    question: "Daun cabai keriting ke atas, apakah ini gejala thrips?",
  };

  it("create: wajib login", async () => {
    auth.mockResolvedValue(null);
    expect(await createConsultationAction(undefined, form(valid))).toEqual({
      error: "Silakan login dulu",
    });
    expect(svc.createConsultation).not.toHaveBeenCalled();
  });

  it("create: validasi gagal mengembalikan pesan pertama", async () => {
    auth.mockResolvedValue({ user: petani });
    const res = await createConsultationAction(undefined, form({ ...valid, question: "pendek" }));
    expect(res).toEqual({ error: "Pertanyaan minimal 20 karakter" });
  });

  it("create: sukses -> ok + revalidate", async () => {
    auth.mockResolvedValue({ user: petani });
    svc.createConsultation.mockResolvedValue({});
    expect(await createConsultationAction(undefined, form(valid))).toEqual({ ok: true });
    expect(svc.createConsultation).toHaveBeenCalledWith("u1", expect.objectContaining({ topic: "HAMA" }));
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/konsultasi");
  });

  it("create: AppError dari service jadi pesan error", async () => {
    auth.mockResolvedValue({ user: petani });
    svc.createConsultation.mockRejectedValue(new AppError("Database tidak tersedia", "DB_UNAVAILABLE"));
    expect(await createConsultationAction(undefined, form(valid))).toEqual({
      error: "Database tidak tersedia",
    });
  });

  it("answer: PETANI ditolak", async () => {
    auth.mockResolvedValue({ user: petani });
    expect(await answerConsultationAction("k1", undefined, form({ answer: "Jawaban cukup panjang" }))).toEqual({
      error: "Hanya pakar/admin yang bisa menjawab",
    });
    expect(svc.answerConsultation).not.toHaveBeenCalled();
  });

  it("answer: PAKAR sukses", async () => {
    auth.mockResolvedValue({ user: pakar });
    svc.answerConsultation.mockResolvedValue({});
    const res = await answerConsultationAction("k1", undefined, form({ answer: "Jawaban cukup panjang" }));
    expect(res).toEqual({ ok: true });
    expect(svc.answerConsultation).toHaveBeenCalledWith("k1", "p1", "Jawaban cukup panjang");
  });
});

describe("auth.actions", () => {
  it("login: validasi gagal tidak memanggil signIn", async () => {
    const res = await loginAction(undefined, form({ email: "bukan-email", password: "rahasia123" }));
    expect(res).toEqual({ error: "Email tidak valid" });
    expect(signIn).not.toHaveBeenCalled();
  });

  it("login: callbackUrl eksternal diganti /dashboard (cegah open redirect)", async () => {
    signIn.mockResolvedValue(undefined);
    await loginAction(
      undefined,
      form({ email: "p@tanimaju.id", password: "rahasia123", callbackUrl: "https://evil.com" }),
    );
    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: "p@tanimaju.id",
      password: "rahasia123",
      redirectTo: "/dashboard",
    });
  });

  it("register: email terpakai -> pesan error, tidak login", async () => {
    svc.registerUser.mockRejectedValue(new AppError("Email sudah terdaftar", "EMAIL_TAKEN"));
    const res = await registerAction(
      undefined,
      form({
        name: "Petani",
        email: "p@tanimaju.id",
        password: "rahasia123",
        confirmPassword: "rahasia123",
      }),
    );
    expect(res).toEqual({ error: "Email sudah terdaftar" });
    expect(signIn).not.toHaveBeenCalled();
  });
});
