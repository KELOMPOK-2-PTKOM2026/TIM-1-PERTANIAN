import { notFound } from "next/navigation";
import ArticleForm from "@/components/features/admin/ArticleForm";
import { MockBanner, PageHeader } from "@/components/features/admin/ui";
import { isMockMode } from "@/lib/data";
import { getArticleById } from "@/modules/artikel/artikel.service";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();
  const mock = isMockMode();

  return (
    <>
      {mock && <MockBanner />}
      <PageHeader title="Edit Artikel" description={article.title} />
      <ArticleForm article={article} readOnly={mock} />
    </>
  );
}
