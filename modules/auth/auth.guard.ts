import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Role, SessionUser } from "./auth.types";

// Guard server-side untuk Server Component / Server Action.
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();
  return (session?.user as SessionUser | undefined) ?? null;
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

// Role di JWT bisa basi (diturunkan/dihapus setelah login), jadi cek ulang ke DB.
export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const user = await requireUser();
  const fresh = prisma
    ? await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } })
    : { role: user.role };
  if (!fresh) redirect("/login");
  if (!roles.includes(fresh.role)) redirect("/dashboard");
  return { ...user, role: fresh.role };
}
