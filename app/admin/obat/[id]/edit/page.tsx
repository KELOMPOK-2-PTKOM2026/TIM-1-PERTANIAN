import { notFound } from "next/navigation";
import PesticideForm from "@/components/features/admin/PesticideForm";
import { PageHeader } from "@/components/features/admin/ui";
import { getPesticideById } from "@/modules/obat/obat.service";

export default async function EditPesticidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getPesticideById(id);
  if (!item) notFound();

  return (
    <>
      <PageHeader title="Edit Obat" description={item.name} />
      <PesticideForm item={item} />
    </>
  );
}
