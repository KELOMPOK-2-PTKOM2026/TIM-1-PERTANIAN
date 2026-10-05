export default function HeroComponent() {
  return (
    <section className="mx-auto flex min-h-[358px] w-full max-w-6xl flex-col justify-between px-4 pt-8 pb-4 font-[family-name:var(--font-jakarta-sans)]">
      <div className="flex flex-col items-start gap-4 self-stretch">
        <h1 className="text-[48px] font-extrabold leading-[50px] tracking-[-0.9px] text-[#084734]">
          Pusat Wawasan & Panduan Riset Pertanian Nusantara
        </h1>
        <p className="text-[20px] font-normal leading-[29.25px] text-[#111C2D]">
          Kumpulan artikel edukatif, panduan praktis budidaya, solusi proteksi
          hama, serta inovasi teknologi smart farming dari para agronom dan
          praktisi terpercaya.
        </p>
      </div>
    </section>
  );
}
