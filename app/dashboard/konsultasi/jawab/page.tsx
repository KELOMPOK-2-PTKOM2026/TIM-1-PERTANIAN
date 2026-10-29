import AnswerForm from "@/components/features/konsultasi/AnswerForm";
import ConsultationCard from "@/components/features/konsultasi/ConsultationCard";
import { requireRole } from "@/modules/auth/auth.guard";
import { listOpen } from "@/modules/konsultasi/konsultasi.service";

// Antrian pertanyaan untuk PAKAR / ADMIN, yang terlama di atas.
export default async function JawabKonsultasiPage() {
  await requireRole("PAKAR", "ADMIN");
  const items = await listOpen();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Jawab Pertanyaan</h1>
        <p className="mt-1 text-sm text-stone-600">{items.length} pertanyaan menunggu jawaban.</p>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-stone-500">Semua pertanyaan sudah dijawab.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <ConsultationCard key={item.id} item={item} showAsker>
              <AnswerForm id={item.id} />
            </ConsultationCard>
          ))}
        </div>
      )}
    </div>
  );
}
