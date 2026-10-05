import TentangForm from "@/components/features/admin/TentangForm";
import { MockBanner, PageHeader } from "@/components/features/admin/ui";
import { isMockMode } from "@/lib/data";
import { getTentangContent } from "@/modules/tentang/tentang.service";

export default async function AdminTentangPage() {
  const mock = isMockMode();
  const content = await getTentangContent();
  return (
    <>
      {mock && <MockBanner />}
      <PageHeader
        title="Halaman Tentang"
        description="Edit hero, misi, perjalanan, dan profil anggota yang tampil di halaman Tentang."
      />
      <TentangForm initial={content} readOnly={mock} />
    </>
  );
}
