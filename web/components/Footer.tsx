import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 bg-tani-950 text-tani-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-white">🌾 TaniMaju</p>
          <p className="mt-2 text-sm">
            Informasi dan edukasi untuk petani Indonesia: harga pasar, tips budidaya, dan solusi
            masalah tanaman.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Jelajahi</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link href="/artikel" className="hover:underline">
                Artikel & Edukasi
              </Link>
            </li>
            <li>
              <Link href="/harga-pasar" className="hover:underline">
                Harga Pasar
              </Link>
            </li>
            <li>
              <Link href="/segera-hadir?fitur=konsultasi" className="hover:underline">
                Konsultasi via Dashboard (Segera)
              </Link>
            </li>
            <li>
              <Link href="/segera-hadir?fitur=obat" className="hover:underline">
                Info Obat (Segera)
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Keterangan Data</p>
          <p className="mt-2 text-sm">
            Data harga pada MVP ini dimasukkan manual oleh admin dan bersifat contoh. Selalu
            konfirmasi ke pasar setempat sebelum mengambil keputusan jual.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">
        © 2026 TaniMaju — MVP pertanian untuk petani Indonesia
      </div>
    </footer>
  );
}
