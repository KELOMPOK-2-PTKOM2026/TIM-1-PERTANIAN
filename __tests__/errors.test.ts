import { describe, expect, it } from "vitest";
import { AppError } from "@/lib/errors";

describe("AppError", () => {
  it("menyimpan message dan code", () => {
    const err = new AppError("Email sudah terdaftar", "EMAIL_TAKEN");
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("AppError");
    expect(err.message).toBe("Email sudah terdaftar");
    expect(err.code).toBe("EMAIL_TAKEN");
  });

  it("default code INTERNAL", () => {
    const err = new AppError("boom");
    expect(err.code).toBe("INTERNAL");
  });
});
