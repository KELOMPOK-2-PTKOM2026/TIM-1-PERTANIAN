export const revalidate = 60;

const missions = [
  {
    title: "Pemberdayaan Petani Muda",
    description:
      "Mendorong generasi muda untuk terjun ke bidang pertanian dengan pendekatan modern dan berkelanjutan.",
  },
  {
    title: "Teknologi Pertanian Terjangkau",
    description:
      "Menyediakan akses teknologi pertanian yang mudah dipahami dan diterapkan oleh seluruh petani Indonesia.",
  },
  {
    title: "Transparansi Rantai Pasok",
    description:
      "Membangun sistem rantai pasok yang adil dan transparan dari petani hingga konsumen akhir.",
  },
];

const journey = [
  {
    year: "2026",
    title: "Awal Mula di Lombok",
    description:
      "Tanimaju berawal dari kepedulian terhadap petani cabai di Lombok yang kesulitan mengakses informasi pertanian.",
  },
  {
    year: "2026",
    title: "Peluncuran di Generasi Petani Generasi 1",
    description:
      "Meluncurkan program edukasi pertanian digital untuk generasi muda petani di berbagai daerah.",
  },
  {
    year: "2026",
    title: "Ekspansi Layanan Terpadu Nasional",
    description:
      "Memperluas layanan ke seluruh Indonesia dengan platform terpadu untuk petani dan pemangku kepentingan.",
  },
];

const team = [
  { name: "I Ketut Pasek Oka Suntari", role: "Ketua Umum" },
  { name: "Muhammad Naufal Azis", role: "Wakil Ketua Umum" },
  { name: "Muhammad Alfarizi", role: "Sekretaris" },
  { name: "Putu Luh Citra Dewi", role: "Bendahara" },
  { name: "I Gede Suardika", role: "Anggota" },
  { name: "Rian", role: "Anggota" },
];

export default function TentangPage() {
  return (
    <div className="font-[family-name:var(--font-jakarta-sans)]">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-4">
        <h1 className="mx-auto max-w-3xl text-center text-[40px] font-extrabold leading-[44px] tracking-[-0.8px] text-[#002C17]">
          Membawa Inovasi Teknologi ke Akar Pertanian Indonesia
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[16px] leading-[24px] text-[#414942]">
          Kami berdedikasi memberdayakan petani lokal melalui ekosistem digital
          terpadu dari sensor tanah presisi hingga akses pasar yang adil dan
          transparan.
        </p>
      </section>

      {/* Hero Image */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="relative mt-5 overflow-hidden rounded-2xl bg-[#084734] shadow-[0_8px_30px_0_rgba(19,78,74,0.90)]">
          <img
            src="https://placehold.co/1200x400/084734/ffffff?text=Tanimaju"
            alt="Tanimaju"
            className="h-96 w-full object-cover opacity-80 md:h-[448px]"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <svg
                  className="h-8 w-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                Membangun Masa Depan Pertanian
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Misi & Dedikasi */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-center text-[28px] font-extrabold leading-[32px] text-[#084734]">
          Misi & Dedikasi Tanimaju
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-[14px] leading-[20px] text-[#404847]">
          Tanimaju berkomitmen untuk membawa perubahan positif bagi petani
          Indonesia melalui tiga pilar utama.
        </p>
        <div className="mt-8 grid gap-4 grid-cols-1 lg:grid-cols-3">
          {missions.map((m) => (
            <div
              key={m.title}
              className="rounded-2xl bg-[#CDEDB3] p-6 shadow-[0_4px_18px_0_rgba(19,78,74,0.10)]"
            >
              <h3 className="text-[16px] font-bold leading-[20px] text-[#084734]">
                {m.title}
              </h3>
              <p className="mt-2 text-[13px] leading-[18px] text-[#404847]">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Perjalanan */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-center text-[28px] font-extrabold leading-[32px] text-[#084734]">
          Perjalanan Tanimaju
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-[14px] leading-[20px] text-[#404847]">
          Langkah-langkah penting dalam perjalanan kami membangun ekosistem
          pertanian yang lebih baik.
        </p>
        <div className="mt-8 grid gap-4 grid-cols-1 lg:grid-cols-3">
          {journey.map((j) => (
            <div
              key={j.title}
              className="rounded-2xl bg-[#CDEDB3] p-6 shadow-[0_4px_18px_0_rgba(19,78,74,0.10)]"
            >
              <span className="inline-block rounded-full bg-[#084734] px-3 py-1 text-[12px] font-bold text-white">
                {j.year}
              </span>
              <h3 className="mt-3 text-[16px] font-bold leading-[20px] text-[#084734]">
                {j.title}
              </h3>
              <p className="mt-2 text-[13px] leading-[18px] text-[#264e21]">
                {j.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Profil Anggota */}
      <section className="mx-auto max-w-6xl px-4 py-8 pb-16">
        <h2 className="text-center text-[28px] font-extrabold leading-[32px] text-[#084734]">
          Profil Anggota Tanimaju
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-[14px] leading-[20px] text-[#404847]">
          Orang-orang di balik Tanimaju yang berdedikasi untuk kemajuan
          pertanian Indonesia.
        </p>
        <div className="mt-8 grid gap-4 grid-cols-1 lg:grid-cols-3">
          {team.map((t) => (
            <div
              key={t.name}
              className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-[0_4px_18px_0_rgba(19,78,74,0.10)]"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#CDEDB3] text-[24px] font-bold text-[#084734]">
                {t.name.charAt(0)}
              </div>
              <h3 className="mt-4 text-[15px] font-bold leading-[18px] text-[#084734]">
                {t.name}
              </h3>
              <p className="mt-1 text-[13px] text-[#404847]">{t.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
