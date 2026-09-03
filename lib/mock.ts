export type ArticleCategory = "PENGETAHUAN" | "KIAT" | "SOLUSI" | "INSPIRASI";

export const CATEGORY_LABEL: Record<ArticleCategory, string> = {
  PENGETAHUAN: "Info & Wawasan",
  KIAT: "Kiat Pertanian",
  SOLUSI: "Solusi Masalah",
  INSPIRASI: "Berita Inspirasi",
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  contentMd: string;
  category: ArticleCategory;
  tags: string[];
  publishedAt: string; // ISO
  views: number;
};

export type Commodity = { id: string; name: string; unit: string };
export type Market = { id: string; name: string; city: string };
export type PricePoint = {
  commodityId: string;
  marketId: string;
  price: number;
  date: string; // yyyy-mm-dd
};

const day = 86400000;
const now = Date.now();

export const MOCK_ARTICLES: Article[] = [
  {
    slug: "mengatasi-daun-cabai-keriting-akibat-thrips",
    title: "Cara Mengatasi Daun Cabai Keriting Akibat Thrips Sampai Panen",
    excerpt:
      "Daun keriting, kaku, dan mengkilap keperakan adalah gejala khas serangan thrips. Kenali cara pengendalian yang tepat agar tanaman pulih dan tetap produktif.",
    contentMd: `## Gejala Serangan Thrips\n\nThrips menyerang daun muda dengan cara mengisap cairan sel. Daun menjadi keriting ke atas, kaku, dan muncul bercak keperakan. Pada serangan berat, pucuk tanaman kerdil dan bunga mudah rontok.\n\n## Pengendalian\n\n1. **Sanitasi lahan** — cabut dan musnahkan gulma inang di sekitar bedengan.\n2. **Perangkap kuning (yellow trap)** — pasang 20–30 lembar per hektar untuk monitoring.\n3. **Penyemprotan insektisida berbahan aktif abamektin atau spinetoram** sesuai dosis label, semprot pagi atau sore hari mengenai permukaan bawah daun.\n4. **Rotasi bahan aktif** setiap 2–3 aplikasi agar hama tidak resisten.\n\n## Pemulihan Tanaman\n\nSetelah populasi terkendali, bantu pemulihan dengan pupuk daun berkadar N seimbang dan asam amino tiap 5–7 hari sekali sampai pucuk baru tumbuh normal.`,
    category: "SOLUSI",
    tags: ["#TanamanCabai", "#CabaiRawit", "thrips"],
    publishedAt: new Date(now - 1 * day).toISOString(),
    views: 214,
  },
  {
    slug: "pupuk-kandang-jangan-asal-pakai",
    title: "Menyuburkan Tanah dengan Pupuk Kandang: Jangan Asal Pakai",
    excerpt:
      "Pupuk kandang mentah bisa menjadi sumber penyakit layu. Pelajari cara fermentasi yang benar sebelum diaplikasikan ke lahan.",
    contentMd: `## Mengapa Harus Difermentasi?\n\nPupuk kandang segar masih mengandung patogen tular tanah seperti Fusarium dan Ralstonia, serta biji gulma. Aplikasi langsung meningkatkan risiko tanaman layu mendadak.\n\n## Cara Fermentasi Sederhana\n\n1. Campur kotoran hewan dengan sekam atau jerami (rasio ±3:1).\n2. Jaga kelembapan 50–60%, tutup dengan terpal.\n3. Balik tumpukan tiap 7 hari. Suhu ideal 55–65°C selama 2–3 minggu.\n4. Pupuk matang ditandai dengan warna cokelat kehitaman, gembur, dan tidak berbau.\n\n## Dosis Anjuran\n\nUntuk cabai, berikan 10–15 ton per hektar sebagai pupuk dasar, dicampur tanah bedengan minimal 7 hari sebelum tanam.`,
    category: "PENGETAHUAN",
    tags: ["pupuk dasar", "#PHTANAH", "#TanahGembur"],
    publishedAt: new Date(now - 2 * day).toISOString(),
    views: 186,
  },
  {
    slug: "olah-lahan-cabai-anti-gagal-musim-hujan",
    title: "Cara Olah Lahan Cabai Anti Gagal Panen di Musim Hujan",
    excerpt:
      "Drainase buruk adalah penyebab utama layu dan busuk batang saat musim hujan. Hindari 5 kesalahan pengolahan lahan berikut.",
    contentMd: `## 5 Kesalahan Fatal\n\n1. Bedengan terlalu rendah (<30 cm) sehingga air menggenang.\n2. Jarak antar bedengan (parit) terlalu sempit untuk aliran air.\n3. Mulsa dipasang sebelum tanah benar-benar matang.\n4. pH tanah tidak dikoreksi dengan dolomit/kapur pertanian.\n5. Sisa tanaman sebelumnya tidak dibersihkan (sumber inokulum).\n\n## Standar Bedengan Musim Hujan\n\n- Tinggi 35–40 cm, lebar 100–110 cm, parit 40–50 cm.\n- Beri dolomit 1–2 ton/ha bila pH < 5,5.\n- Pupuk dasar slow-release (SP-36 + NPK) ditutup tanah, diamkan 7–10 hari sebelum tanam.`,
    category: "KIAT",
    tags: ["#TanamanCabai", "olah lahan", "musim hujan"],
    publishedAt: new Date(now - 3 * day).toISOString(),
    views: 342,
  },
  {
    slug: "kisah-petani-milenial-70-juta-sekali-petik",
    title: "Kisah Petani Milenial: Meraup 70 Juta Rupiah Setiap Kali Petik",
    excerpt:
      "Lulusan universitas ini membuktikan bertani cabai bisa menjadi profesi bergengsi dengan omzet puluhan juta per petikan.",
    contentMd: `## Berawal dari Lahan Sewa\n\nDengan modal sewa lahan setengah hektar, ia menerapkan budidaya cabai rawit intensif: benih unggul, mulsa, pengairan tetes sederhana, dan pencatatan biaya harian.\n\n## Kunci Keberhasilan\n\n- **Disiplin monitoring** — keliling lahan tiap pagi untuk deteksi dini hama.\n- **Panen tepat waktu** — petik tiap 3–4 hari agar buah atas terus membesar.\n- **Jual ke pengepul tetap** dengan grading buah untuk harga premium.\n\nSemangatnya menjadi inspirasi bahwa pertanian modern terbuka untuk generasi muda.`,
    category: "INSPIRASI",
    tags: ["petani milenial", "#CabaiRawit"],
    publishedAt: new Date(now - 4 * day).toISOString(),
    views: 528,
  },
  {
    slug: "bedengan-besar-vs-kecil-cabai",
    title: "Bedengan Besar vs Kecil: Mana yang Lebih Menguntungkan untuk Cabai?",
    excerpt:
      "Lebar bedengan memengaruhi populasi tanaman, sirkulasi udara, dan kemudahan perawatan. Simak perbandingannya.",
    contentMd: `## Bedengan Besar (1 Lajur)\n\n- Sirkulasi udara baik, kelembapan rendah, serangan jamur lebih kecil.\n- Populasi ±14.000–16.000 tanaman/ha.\n- Cocok untuk musim hujan dan dataran rendah yang lembap.\n\n## Bedengan Kecil (2 Lajur)\n\n- Populasi tinggi ±20.000–24.000 tanaman/ha, potensi hasil per hektar lebih besar.\n- Butuh drainase ekstra dan pengendalian penyakit lebih intensif.\n- Cocok untuk musim kemarau dengan irigasi terjamin.\n\n## Kesimpulan\n\nTidak ada yang mutlak lebih baik — sesuaikan dengan musim, topografi, dan kemampuan perawatan. Bagi pemula, 1 lajur lebih aman.`,
    category: "KIAT",
    tags: ["bedengan", "#TanamanCabai"],
    publishedAt: new Date(now - 5 * day).toISOString(),
    views: 197,
  },
  {
    slug: "penyebab-bunga-rontok-dan-cara-mengatasi",
    title: "Inilah Beberapa Penyebab Bunga Rontok dan Cara Mengatasinya",
    excerpt:
      "Bunga cabai rontok massal? Bisa karena lalat buah, kekurangan kalsium-boron, atau stres air. Begini cara membedakannya.",
    contentMd: `## Penyebab Umum\n\n1. **Serangan lalat buah dan thrips** pada kuncup bunga.\n2. **Kekurangan kalsium dan boron** — bunga kuning lalu gugur.\n3. **Cekaman air** — kekeringan maupun genangan memicu stres.\n4. **Nitrogen berlebih** — tanaman terlalu vigor, bunga kalah bersaing.\n\n## Solusi\n\n- Semprot kalsium + boron tiap 7–10 hari pada fase pembungaan.\n- Jaga lengas tanah stabil, hindari pengocoran urea berlebih.\n- Pasang perangkap lalat buah (metil eugenol) di perimeter lahan.`,
    category: "SOLUSI",
    tags: ["#buahrontok", "#PUPUKBUNGABUAH"],
    publishedAt: new Date(now - 6 * day).toISOString(),
    views: 263,
  },
  {
    slug: "waktu-terbaik-tanam-cabai-kejar-harga",
    title: "Ini Waktu Terbaik Tanam Cabai: Peluang Panen Dapat Harga Tinggi",
    excerpt:
      "Harga cabai berfluktuasi mengikuti musim tanam massal. Atur jadwal tanam agar panen raya jatuh di momen harga tinggi.",
    contentMd: `## Pola Harga\n\nHarga cabai umumnya melemah saat panen raya serentak (musim kemarau) dan menguat di peralihan musim hujan ketika banyak tanaman terserang penyakit.\n\n## Strategi\n\n- Tanam 3–4 bulan sebelum perkiraan harga tinggi (siklus cabai ±90 HST mulai panen).\n- Pantau halaman Harga Pasar situs ini untuk melihat tren 30 hari terakhir.\n- Jangan menanam serentak dengan tetangga satu hamparan tanpa perhitungan pasar.`,
    category: "PENGETAHUAN",
    tags: ["harga pasar", "#BALIKMODAL"],
    publishedAt: new Date(now - 7 * day).toISOString(),
    views: 311,
  },
  {
    slug: "pelajar-sma-sukses-cabai-greenhouse",
    title: "Muda Penuh Karya: Pelajar SMA Sukses Budidaya Cabai dengan Greenhouse",
    excerpt:
      "Keterbatasan lahan kota bukan halangan. Greenhouse bambu sederhana menjadi model urban farming yang inspiratif.",
    contentMd: `## Greenhouse Bambu Low-Cost\n\nRangka bambu + plastik UV bekas pakai menekan biaya hingga sepertiganya dibanding baja ringan. Ventilasi samping menjaga suhu tetap ideal untuk cabai.\n\n## Hasil\n\nDengan 500 polibag, panen perdana menghasilkan puluhan kilogram yang dijual ke warung sekitar dan tetangga — perputaran kas positif sejak musim pertama.\n\nUrban farming seperti ini bisa direplikasi di pekarangan sekolah maupun rumah.`,
    category: "INSPIRASI",
    tags: ["urban farming", "greenhouse"],
    publishedAt: new Date(now - 8 * day).toISOString(),
    views: 154,
  },
];

export const MOCK_COMMODITIES: Commodity[] = [
  { id: "c-rawit", name: "Cabai Rawit", unit: "kg" },
  { id: "c-cmk", name: "Cabai Merah Keriting", unit: "kg" },
  { id: "c-bamer", name: "Bawang Merah", unit: "kg" },
  { id: "c-tomat", name: "Tomat", unit: "kg" },
  { id: "c-melon", name: "Melon", unit: "kg" },
  { id: "c-beras", name: "Beras Medium", unit: "kg" },
];

export const MOCK_MARKETS: Market[] = [
  { id: "m-muntilan", name: "Pasar Muntilan", city: "Magelang" },
  { id: "m-beringharjo", name: "Pasar Beringharjo", city: "Yogyakarta" },
  { id: "m-kramat", name: "Pasar Induk Kramat Jati", city: "Jakarta Timur" },
];

const BASE: Record<string, number> = {
  "c-rawit": 45000,
  "c-cmk": 38000,
  "c-bamer": 32000,
  "c-tomat": 12000,
  "c-melon": 15000,
  "c-beras": 13500,
};

function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export const MOCK_PRICES: PricePoint[] = (() => {
  const rows: PricePoint[] = [];
  for (const c of MOCK_COMMODITIES) {
    for (const m of MOCK_MARKETS) {
      const adj = m.id === "m-kramat" ? 1.12 : m.id === "m-beringharjo" ? 1.05 : 1;
      for (let d = 29; d >= 0; d--) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - d);
        const wave = Math.sin(d / 3.1) * 0.05 + Math.cos(d / 7.7) * 0.04;
        const noise = (((29 - d) * 7919) % 13) / 13 - 0.5;
        const price = Math.round(((BASE[c.id] * adj) * (1 + wave + noise * 0.06)) / 50) * 50;
        rows.push({ commodityId: c.id, marketId: m.id, price, date: toISODate(date) });
      }
    }
  }
  return rows;
})();
