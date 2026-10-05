import ProfileForm from "@/components/features/admin/ProfileForm";
import { MockBanner, PageHeader } from "@/components/features/admin/ui";
import { prisma } from "@/lib/db";
import { requireRole } from "@/modules/auth/auth.guard";

export default async function AdminPengaturanPage() {
  const user = await requireRole("ADMIN");
  const row = prisma ? await prisma.user.findUnique({ where: { id: user.id } }) : null;

  return (
    <>
      {!prisma && <MockBanner />}
      <PageHeader title="Pengaturan" description="Profil akun admin." />
      <ProfileForm
        profile={{
          name: row?.name ?? user.name,
          email: user.email,
          city: row?.city ?? null,
          whatsapp: row?.whatsapp ?? null,
        }}
      />
    </>
  );
}
