import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors";
import type { RegisterInput } from "./auth.schema";
import type { SessionUser } from "./auth.types";

function db() {
  if (!prisma) throw new AppError("Database tidak tersedia", "DB_UNAVAILABLE");
  return prisma;
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function registerUser(input: RegisterInput): Promise<SessionUser> {
  const existing = await db().user.findUnique({ where: { email: input.email } });
  if (existing) throw new AppError("Email sudah terdaftar", "EMAIL_TAKEN");

  const user = await db().user.create({
    data: {
      email: input.email,
      name: input.name,
      city: input.city || null,
      whatsapp: input.whatsapp || null,
      passwordHash: await hashPassword(input.password),
    },
  });
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

// null bila email tidak ada atau password salah (pesan sengaja disamakan).
export async function authenticate(email: string, password: string): Promise<SessionUser | null> {
  const user = await db().user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}
