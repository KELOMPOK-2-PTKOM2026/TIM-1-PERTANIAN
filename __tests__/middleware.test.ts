import { describe, expect, it } from "vitest";
import { decideAuthRedirect, getSafeCallbackUrl } from "@/lib/route-guard";

describe("middleware decideAuthRedirect (proxy.ts)", () => {
  it("belum login ke /dashboard -> redirect /login + callbackUrl", () => {
    const d = decideAuthRedirect("/dashboard", "", null);
    expect(d).toEqual({
      action: "redirect",
      to: "/login?callbackUrl=%2Fdashboard",
    });
  });

  it("belum login ke /admin -> redirect /login", () => {
    const d = decideAuthRedirect("/admin/harga", "", undefined);
    expect(d.action).toBe("redirect");
  });

  it("PETANI ke /admin -> redirect /dashboard", () => {
    expect(decideAuthRedirect("/admin/obat", "", "PETANI")).toEqual({
      action: "redirect",
      to: "/dashboard",
    });
  });

  it("PAKAR ke /admin -> redirect /dashboard", () => {
    expect(decideAuthRedirect("/admin", "", "PAKAR").action).toBe("redirect");
  });

  it("ADMIN ke /admin -> next", () => {
    expect(decideAuthRedirect("/admin/harga", "", "ADMIN")).toEqual({ action: "next" });
  });

  it("PETANI ke /dashboard -> next", () => {
    expect(decideAuthRedirect("/dashboard/konsultasi", "", "PETANI")).toEqual({ action: "next" });
  });

  it("sudah login buka /login -> redirect /dashboard", () => {
    expect(decideAuthRedirect("/login", "", "PETANI")).toEqual({
      action: "redirect",
      to: "/dashboard",
    });
  });

  it("belum login buka /login dan /register -> next (tidak loop)", () => {
    expect(decideAuthRedirect("/login", "", null)).toEqual({ action: "next" });
    expect(decideAuthRedirect("/register", "", undefined)).toEqual({ action: "next" });
  });
});

describe("getSafeCallbackUrl (cegah open redirect)", () => {
  it("mengizinkan path internal", () => {
    expect(getSafeCallbackUrl("/dashboard/konsultasi")).toBe("/dashboard/konsultasi");
  });

  it("menolak URL eksternal dan fallback ke /dashboard", () => {
    expect(getSafeCallbackUrl("https://evil.com")).toBe("/dashboard");
    expect(getSafeCallbackUrl("//evil.com")).toBe("/dashboard");
    expect(getSafeCallbackUrl(null)).toBe("/dashboard");
    expect(getSafeCallbackUrl("")).toBe("/dashboard");
  });
});
