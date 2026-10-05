import ArticleForm from "@/components/features/admin/ArticleForm";
import { MockBanner, PageHeader } from "@/components/features/admin/ui";
import { isMockMode } from "@/lib/data";

export default function NewArticlePage() {
  const mock = isMockMode();
  return (
    <>
      {mock && <MockBanner />}
      <PageHeader title="Tulis Artikel" description="Simpan sebagai draft atau langsung terbitkan." />
      <ArticleForm readOnly={mock} />
    </>
  );
}
