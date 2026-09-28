import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "@/modules/auth/auth.schema";

describe("loginSchema", () => {
  it("menerima email+password valid", () => {
    const r = loginSchema.safeParse({ email: "Petani@Mail.com ", password: "rahasia123" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe("petani@mail.com");
  });

  it("menolak email invalid dan password pendek", () => {
    expect(loginSchema.safeParse({ email: "bukan-email", password: "rahasia123" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "a@b.com", password: "pendek" }).success).toBe(false);
  });
});

describe("registerSchema", () => {
  const valid = {
    name: "Pak Tani",
    email: "tani@mail.com",
    password: "rahasia123",
    confirmPassword: "rahasia123",
    city: "Magelang",
    whatsapp: "08123456789",
  };

  it("menerima data valid", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("menolak jika konfirmasi beda", () => {
    const r = registerSchema.safeParse({ ...valid, confirmPassword: "beda12345" });
    expect(r.success).toBe(false);
  });

  it("menolak whatsapp invalid, mengizinkan kosong", () => {
    expect(registerSchema.safeParse({ ...valid, whatsapp: "123" }).success).toBe(false);
    expect(registerSchema.safeParse({ ...valid, whatsapp: "" }).success).toBe(true);
    const tanpaWa: Partial<typeof valid> = { ...valid };
    delete tanpaWa.whatsapp;
    expect(registerSchema.safeParse(tanpaWa).success).toBe(true);
  });
});
