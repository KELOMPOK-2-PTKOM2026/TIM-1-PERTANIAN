import { prisma } from "@/lib/db";
import { requireUser } from "@/modules/auth/auth.guard";
import { listMine } from "@/modules/konsultasi/konsultasi.service";
import AskForm from "@/components/features/konsultasi/AskForm";
import ConsultationCard from "@/components/features/konsultasi/ConsultationCard";

export default async function KonsultasiPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { welcome } = await searchParams;
  const user = await requireUser();
  const [profile, items] = await Promise.all([
    prisma?.user.findUnique({ where: { id: user.id }, select: { city: true, whatsapp: true } }),
    listMine(user.id),
  ]);

  return (
    <div className="space-y-6">
      {welcome === "1" && (
        <div role="status" className="rounded-2xl border border-tani-200 bg-tani-50 p-4 text-sm text-tani-800">
          <p className="font-semibold">Akun berhasil dibuat. Selamat datang!</p>
        </div>
      )}
      <div>
        <h1 className="text-2xl font-extrabold">Konsultasi Tani</h1>
        <p className="mt-1 text-sm text-stone-600">
          Tanyakan masalah tanamanmu. Pakar akan menjawab dan jawabannya tampil di bawah.
        </p>
      </div>

      <AskForm
        defaults={{ name: user.name, city: profile?.city ?? "", whatsapp: profile?.whatsapp ?? "" }}
      />

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Riwayat pertanyaanmu</h2>
        {items.length === 0 ? (
          <p className="text-sm text-stone-500">Belum ada pertanyaan.</p>
        ) : (
          items.map((item) => <ConsultationCard key={item.id} item={item} />)
        )}
      </section>
    </div>
  );
}
