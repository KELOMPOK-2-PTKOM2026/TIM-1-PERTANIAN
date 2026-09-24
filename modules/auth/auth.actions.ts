"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { AppError } from "@/lib/errors";
import { loginSchema, registerSchema } from "./auth.schema";
import { registerUser } from "./auth.service";
import type { AuthFormState } from "./auth.types";

// Hanya izinkan path internal (cegah open redirect).
function safeCallback(value: FormDataEntryValue | null) {
  const url = typeof value === "string" ? value : "";
  return url.startsWith("/") && !url.startsWith("//") ? url : "/dashboard";
}

export async function loginAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: safeCallback(formData.get("callbackUrl")),
    });
  } catch (e) {
    if (e instanceof AuthError) {
      const cause = e.cause?.err;
      return {
        error: cause instanceof AppError ? cause.message : "Email atau password salah",
      };
    }
    throw e; // redirect sukses dilempar sebagai error Next.js
  }
}

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await registerUser(parsed.data);
  } catch (e) {
    if (e instanceof AppError) return { error: e.message };
    throw e;
  }
  return loginAction(undefined, formData);
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
