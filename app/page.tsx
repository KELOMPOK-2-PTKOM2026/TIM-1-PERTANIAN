import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/Footer";

function SensorIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="2" />
      <path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8" />
    </svg>
  );
}

function CuacaIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-12 0 4 4 0 0 0 2 8z" />
    </svg>
  );
}

function HargaIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 21h18" />
      <path d="M4 17l5-5 4 4 6-7" />
      <path d="M15 9h4v4" />
    </svg>
  );
}

function WaveDivider() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 overflow-hidden">
      {/* SVG dibuat lebih lebar dari section (w-108%) dan digeser -mx-[4%] supaya
          animasi translate horizontal (-1.75rem) tidak pernah membuka celah di tepi. */}
      <svg
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="wave-lag -mx-[4%] block h-20 w-[108%] text-tani-100/70 sm:h-28"
      >
        <path
          fill="currentColor"
          d="M0 96c120 34 250 46 380 34s250-52 380-72 260-6 380 26 220 52 300 44v56H0Z"
        />
      </svg>

      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="-mx-[4%] block h-16 w-[108%] text-tani-50 sm:h-24"
      >
        <path
          fill="currentColor"
          d="M0 72c140 30 280 38 420 24s260-56 400-76 240-4 340 24 200 48 280 40v60H0Z"
        />
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <main className="font-landing">
        {/* Hero — sesuai desain landing page */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-tani-50 via-white to-tani-50">
          {/* Lapisan dekoratif: blob gradient lembut sebagai pengganti background polos.
              Ukuran blob diperkecil di layar kecil supaya tidak menutupi konten. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="wave-drift absolute -left-24 -top-28 h-64 w-64 rounded-full bg-tani-200/70 blur-3xl sm:-left-32 sm:-top-40 sm:h-[26rem] sm:w-[26rem]" />
            <div className="wave-drift wave-drift-slow absolute -right-24 top-12 h-72 w-72 rounded-full bg-lime-200/60 blur-3xl sm:-right-40 sm:top-16 sm:h-[30rem] sm:w-[30rem]" />
            <div className="wave-drift absolute bottom-10 left-1/4 h-56 w-56 rounded-full bg-tani-100/80 blur-3xl sm:h-72 sm:w-72" />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-4 pb-32 pt-8 text-center sm:pb-40 sm:pt-10 md:pt-14">
            <p className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-tani-200 bg-tani-50 px-3 py-1.5 text-[11px] font-semibold text-tani-800 sm:px-4 sm:text-xs">
              <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-tani-600" />
              <span className="text-left">
                Platform Digital untuk Petani Indonesia
              </span>
            </p>

            <h1 className="mx-auto mt-4 max-w-2xl text-[1.75rem] font-extrabold leading-tight text-balance text-tani-950 sm:text-4xl md:text-5xl">
              Masa Depan Pertanian Cerdas.
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm text-pretty text-stone-600 md:text-base">
              Optimalisasi ladang presisi dengan integrasi drone otonom, sensor
              IoT tanah, dan analitik data cuaca langsung untuk petani Indonesia.
            </p>

            {/* Tombol menumpuk dan memenuhi lebar layar di layar kecil agar target sentuh lega */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
              <Link
                href="/harga-pasar"
                className="w-full rounded-full bg-lime-300 px-6 py-3 text-center text-sm font-bold text-tani-950 hover:bg-lime-200 sm:w-auto"
              >
                Mulai Sekarang →
              </Link>

              <Link
                href="/artikel"
                className="w-full rounded-full border border-tani-300 px-6 py-3 text-center text-sm font-bold text-tani-800 hover:bg-tani-50 sm:w-auto"
              >
                Jelajahi Artikel
              </Link>
            </div>

            <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-2xl shadow-lg sm:aspect-[21/9]">
              <Image
                src="/drone-sawah.png"
                alt="Drone memantau lahan pertanian yang hijau"
                fill
                priority
                sizes="(max-width: 640px) 100vw, 1152px"
                className="object-cover"
              />
            </div>

            {/* Stat bar — angka di atas, label di bawah. Class `order-*` lama
                tidak berefek karena anak <dl> ini bukan item flex/grid, jadi
                diganti ke flex-col-reverse. Ukuran mengecil di layar sempit. */}
            <dl className="mt-8 grid grid-cols-1 divide-y divide-tani-600/20 rounded-xl bg-[#CDEDB3] px-4 py-3 text-center sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 sm:py-5">
              <div className="flex flex-col-reverse py-3 sm:py-1">
                <dt className="order-2 mt-1 text-[11px] leading-snug text-tani-900/70 sm:text-xs">
                  Petani Terbantu di Indonesia
                </dt>
                <dd className="order-1 text-2xl font-extrabold text-tani-900">
                  12.000+
                </dd>
              </div>

              <div className="flex flex-col-reverse py-3 sm:py-1">
                <dt className="order-2 mt-1 text-[11px] leading-snug text-tani-900/70 sm:text-xs">
                  Efisiensi Waktu &amp; Biaya
                </dt>
                <dd className="order-1 text-2xl font-extrabold text-tani-900">
                  45%
                </dd>
              </div>

              <div className="flex flex-col-reverse py-3 sm:py-1">
                <dt className="order-2 mt-1 text-[11px] leading-snug text-tani-900/70 sm:text-xs">
                  Akurasi Data Harga Pasar
                </dt>
                <dd className="order-1 text-2xl font-extrabold text-tani-900">
                  99.2%
                </dd>
              </div>
            </dl>

            {/* Fitur unggulan */}
            <div className="mt-12">
              <h2 className="text-balance text-xl font-extrabold text-tani-950 md:text-2xl">
                Teknologi Sederhana, Hasil Maksimal
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-pretty text-sm text-stone-600">
                Satu ekosistem terpadu dari pengawasan tanah sampai harga pasar di
genggaman Anda.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 text-left min-[420px]:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-tani-200 bg-[#CDEDB3] p-5">
                  <span className="text-tani-800">
                    <SensorIcon />
                  </span>

                  <h3 className="mt-3 text-pretty font-bold text-tani-950">
                    Sensor Pintar Ladang
                  </h3>

                  <p className="mt-1 text-pretty text-sm text-stone-600">
                    Pantau kelembapan tanah, suhu, dan nutrisi lahan secara
                    real-time langsung dari ponsel.
                  </p>

                  <Link
                    href="/artikel"
                    className="mt-3 inline-block text-sm font-bold text-tani-700 hover:underline"
                  >
                    Pelajari →
                  </Link>
                </div>

                <div className="rounded-xl border border-tani-200 bg-[#CDEDB3] p-5">
                  <span className="text-tani-800">
                    <CuacaIcon />
                  </span>

                  <h3 className="mt-3 text-pretty font-bold text-tani-950">
                    Prediksi Cuaca &amp; Hama
                  </h3>

                  <p className="mt-1 text-pretty text-sm text-stone-600">
                    Peringatan dini cuaca ekstrem dan serangan hama berbasis
                    data agar panen terlindungi.
                  </p>

                  <Link
                    href="/segera-hadir?fitur=konsultasi"
                    className="mt-3 inline-block text-sm font-bold text-tani-700 hover:underline"
                  >
                    Pelajari →
                  </Link>
                </div>

                <div className="rounded-xl border border-tani-200 bg-[#CDEDB3] p-5">
                  <span className="text-tani-800">
                    <HargaIcon />
                  </span>

                  <h3 className="mt-3 text-pretty font-bold text-tani-950">
                    Akses Harga Pasar Terkini
                  </h3>

                  <p className="mt-1 text-pretty text-sm text-stone-600">
                    Pantau harga komoditas harian dari berbagai pasar sebelum
                    menjual hasil panen.
                  </p>

                  <Link
                    href="/harga-pasar"
                    className="mt-3 inline-block text-sm font-bold text-tani-700 hover:underline"
                  >
                    Pelajari →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <WaveDivider />
        </section>

        {/* Gelombang transisi ke footer — warna sama dengan background footer */}
        <div aria-hidden className="relative -mb-px overflow-hidden">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="wave-lag -mx-[4%] block h-14 w-[108%] text-[#064e3b] sm:h-20"
          >
            <path
              fill="currentColor"
              d="M0 40c150 44 300 60 450 44s280-70 440-92 280-2 380 30 170 46 170 46v52H0Z"
            />
          </svg>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

