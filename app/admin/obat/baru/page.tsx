import PesticideForm from "@/components/features/admin/PesticideForm";
import { MockBanner, PageHeader } from "@/components/features/admin/ui";
import { isMockMode } from "@/lib/data";

export default function NewPesticidePage() {
  const mock = isMockMode();
  return (
    <>
      {mock && <MockBanner />}
      <PageHeader title="Tambah Obat" description="Isi sesuai label resmi produk." />
      <PesticideForm readOnly={mock} />
    </>
  );
}
