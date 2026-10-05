import { PrismaClient, ArticleCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const COMMODITIES = [
  { name: "Cabai Rawit", unit: "kg", base: 45000 },
  { name: "Cabai Merah Keriting", unit: "kg", base: 38000 },
  { name: "Bawang Merah", unit: "kg", base: 32000 },
  { name: "Tomat", unit: "kg", base: 12000 },
  { name: "Melon", unit: "kg", base: 15000 },
  { name: "Beras Medium", unit: "kg", base: 13500 },
];

const MARKETS = [
  { name: "Pasar Muntilan", city: "Magelang" },
  { name: "Pasar Beringharjo", city: "Yogyakarta" },
  { name: "Pasar Induk Kramat Jati", city: "Jakarta Timur" },
];

const PESTICIDES = [
  {
    slug: "proclaim-5-sg",
    name: "Proclaim 5 SG",
    type: "INSEKTISIDA" as const,
    activeIngredient: "Emamektin benzoat 5%",
    targets: "Ulat grayak (Spodoptera frugiperda) pada jagung, bawang merah, dan sayuran daun",
    dosage: "0,2–0,4 g/liter air",
    packaging: "25 g / 50 g",
    manufacturer: "Syngenta",
    description: "Insektisida kontak dan lambung untuk pengendalian ulat.",
  },
  {
    slug: "amistar-top-325-sc",
    name: "Amistar Top 325 SC",
    type: "FUNGISIDA" as const,
    activeIngredient: "Azoksistrobin + Difenokonazol",
    targets: "Antraknosa (patek) pada cabai, blas daun dan hawar pelepah padi",
    dosage: "0,5–1 ml/liter air",
    packaging: "100 ml / 250 ml",
    manufacturer: "Syngenta",
    description: "Fungisida sistemik berspektrum luas.",
  },
  {
    slug: "demolish-18-ec",
    name: "Demolish 18 EC",
    type: "AKARISIDA" as const,
    activeIngredient: "Abamektin 18 g/l",
    targets: "Thrips, tungau merah, dan kutu kebul pada sayuran hortikultura",
    dosage: "0,75 ml/liter air",
    packaging: "100 ml",
    manufacturer: "DGW",
    description: "Insektisida/akarisida translaminar.",
  },
];

type SeedArticle = {
  slug: string;
  title: string;
  excerpt: string;
  contentMd: string;
  category: ArticleCategory;
  tags: string[];
  daysAgo: number;
};

const ARTICLES: SeedArticle[] = [
  {
    slug: "mengatasi-daun-cabai-keriting-akibat-thrips",
    title: "Cara Mengatasi Daun Cabai Keriting Akibat Thrips Sampai Panen",
    excerpt:
      "Daun keriting, kaku, dan mengkilap keperakan adalah gejala khas serangan thrips. Kenali cara pengendalian yang tepat agar tanaman pulih dan tetap produktif.",
    contentMd: `## Gejala Serangan Thrips\n\nThrips menyerang daun muda dengan cara mengisap cairan sel. Daun menjadi keriting ke atas, kaku, dan muncul bercak keperakan. Pada serangan berat, pucuk tanaman kerdil dan bunga mudah rontok.\n\n## Pengendalian\n\n1. **Sanitasi lahan** — cabut dan musnahkan gulma inang di sekitar bedengan.\n2. **Perangkap kuning (yellow trap)** — pasang 20–30 lembar per hektar untuk monitoring.\n3. **Penyemprotan insektisida berbahan aktif abamektin atau spinetoram** sesuai dosis label, semprot pagi atau sore hari mengenai permukaan bawah daun.\n4. **Rotasi bahan aktif** setiap 2–3 aplikasi agar hama tidak resisten.\n\n## Pemulihan Tanaman\n\nSetelah populasi terkendali, bantu pemulihan dengan pupuk daun berkadar N seimbang dan asam amino tiap 5–7 hari sekali sampai pucuk baru tumbuh normal.`,
    category: "SOLUSI",
    tags: ["#TanamanCabai", "#CabaiRawit", "thrips"],
    daysAgo: 1,
  },
  {
    slug: "pupuk-kandang-jangan-asal-pakai",
    title: "Menyuburkan Tanah dengan Pupuk Kandang: Jangan Asal Pakai",
    excerpt:
      "Pupuk kandang mentah bisa menjadi sumber penyakit layu. Pelajari cara fermentasi yang benar sebelum diaplikasikan ke lahan.",
    contentMd: `## Mengapa Harus Difermentasi?\n\nPupuk kandang segar masih mengandung patogen tular tanah seperti *Fusarium* dan *Ralstonia*, serta biji gulma. Aplikasi langsung meningkatkan risiko tanaman layu mendadak.\n\n## Cara Fermentasi Sederhana\n\n1. Campur kotoran hewan dengan sekam atau jerami (rasio ±3:1).\n2. Jaga kelembapan 50–60%, tutup dengan terpal.\n3. Balik tumpukan tiap 7 hari. Suhu ideal 55–65°C selama 2–3 minggu.\n4. Pupuk matang ditandai dengan warna cokelat kehitaman, gembur, dan tidak berbau.\n\n## Dosis Anjuran\n\nUntuk cabai, berikan 10–15 ton per hektar sebagai pupuk dasar, dicampur tanah bedengan minimal 7 hari sebelum tanam.`,
    category: "PENGETAHUAN",
    tags: ["pupuk dasar", "#PHTANAH", "#TanahGembur"],
    daysAgo: 2,
  },
  {
    slug: "olah-lahan-cabai-anti-gagal-musim-hujan",
    title: "Cara Olah Lahan Cabai Anti Gagal Panen di Musim Hujan",
    excerpt:
      "Drainase buruk adalah penyebab utama layu dan busuk batang saat musim hujan. Hindari 5 kesalahan pengolahan lahan berikut.",
    contentMd: `## 5 Kesalahan Fatal\n\n1. Bedengan terlalu rendah (<30 cm) sehingga air menggenang.\n2. Jarak antar bedengan (parit) terlalu sempit untuk aliran air.\n3. Mulsa dipasang sebelum tanah benar-benar matang.\n4. pH tanah tidak dikoreksi dengan dolomit/kapur pertanian.\n5. Sisa tanaman sebelumnya tidak dibersihkan (sumber inokulum).\n\n## Standar Bedengan Musim Hujan\n\n- Tinggi 35–40 cm, lebar 100–110 cm, parit 40–50 cm.\n- Beri dolomit 1–2 ton/ha bila pH < 5,5.\n- Pupuk dasar slow-release (SP-36 + NPK) ditutup tanah, diamkan 7–10 hari sebelum tanam.`,
    category: "KIAT",
    tags: ["#TanamanCabai", "olah lahan", "musim hujan"],
    daysAgo: 3,
  },
  {
    slug: "kisah-petani-milenial-70-juta-sekali-petik",
    title: "Kisah Petani Milenial: Meraup 70 Juta Rupiah Setiap Kali Petik",
    excerpt:
      "Lulusan universitas ini membuktikan bertani cabai bisa menjadi profesi bergengsi dengan omzet puluhan juta per petikan.",
    contentMd: `## Berawal dari Lahan Sewa\n\nDengan modal sewa lahan setengah hektar, ia menerapkan budidaya cabai rawit intensif: benih unggul, mulsa, pengairan tetes sederhana, dan pencatatan biaya harian.\n\n## Kunci Keberhasilan\n\n- **Disiplin monitoring** — keliling lahan tiap pagi untuk deteksi dini hama.\n- **Panen tepat waktu** — petik tiap 3–4 hari agar buah atas terus membesar.\n- **Jual ke pengepul tetap** dengan grading buah untuk harga premium.\n\nSemangatnya menjadi inspirasi bahwa pertanian modern terbuka untuk generasi muda.`,
    category: "INSPIRASI",
    tags: ["petani milenial", "#CabaiRawit"],
    daysAgo: 4,
  },
  {
    slug: "bedengan-besar-vs-kecil-cabai",
    title: "Bedengan Besar vs Kecil: Mana yang Lebih Menguntungkan untuk Cabai?",
    excerpt:
      "Lebar bedengan memengaruhi populasi tanaman, sirkulasi udara, dan kemudahan perawatan. Simak perbandingannya.",
    contentMd: `## Bedengan Besar (1 Lajur)\n\n- Sirkulasi udara baik, kelembapan rendah, serangan jamur lebih kecil.\n- Populasi ±14.000–16.000 tanaman/ha.\n- Cocok untuk musim hujan dan dataran rendah yang lembap.\n\n## Bedengan Kecil (2 Lajur)\n\n- Populasi tinggi ±20.000–24.000 tanaman/ha, potensi hasil per hektar lebih besar.\n- Butuh drainase ekstra dan pengendalian penyakit lebih intensif.\n- Cocok untuk musim kemarau dengan irigasi terjamin.\n\n## Kesimpulan\n\nTidak ada yang mutlak lebih baik — sesuaikan dengan musim, topografi, dan kemampuan perawatan. Bagi pemula, 1 lajur lebih aman.`,
    category: "KIAT",
    tags: ["bedengan", "#TanamanCabai"],
    daysAgo: 5,
  },
  {
    slug: "penyebab-bunga-rontok-dan-cara-mengatasi",
    title: "Inilah Beberapa Penyebab Bunga Rontok dan Cara Mengatasinya",
    excerpt:
      "Bunga cabai rontok massal? Bisa karena lalat buah, kekurangan kalsium-boron, atau stres air. Begini cara membedakannya.",
    contentMd: `## Penyebab Umum\n\n1. **Serangan lalat buah dan thrips** pada kuncup bunga.\n2. **Kekurangan kalsium dan boron** — bunga kuning lalu gugur.\n3. **Kekebalan air** — kekeringan maupun genangan memicu stres.\n4. **Nitrogen berlebih** — tanaman terlalu vigor, bunga kalah bersaing.\n\n## Solusi\n\n- Semprot kalsium + boron tiap 7–10 hari pada fase pembungaan.\n- Jaga lengas tanah stabil, hindari pengocoran urea berlebih.\n- Pasang perangkap lalat buah (metil eugenol) di perimeter lahan.`,
    category: "SOLUSI",
    tags: ["#buahrontok", "#PUPUKBUNGABUAH"],
    daysAgo: 6,
  },
  {
    slug: "waktu-terbaik-tanam-cabai-kejar-harga",
    title: "Ini Waktu Terbaik Tanam Cabai: Peluang Panen Dapat Harga Tinggi",
    excerpt:
      "Harga cabai berfluktuasi mengikuti musim tanam massal. Atur jadwal tanam agar panen raya jatuh di momen harga tinggi.",
    contentMd: `## Pola Harga\n\nHarga cabai umumnya melemah saat panen raya serentak (musim kemarau) dan menguat di peralihan musim hujan ketika banyak tanaman terserang penyakit.\n\n## Strategi\n\n- Tanam 3–4 bulan sebelum perkiraan harga tinggi (siklus cabai ±90 HST mulai panen).\n- Pantau halaman **Harga Pasar** situs ini untuk melihat tren 30 hari terakhir.\n- Jangan menanam serentak dengan tetangga satu hamparan tanpa perhitungan pasar.\n\n> Data harga di situs ini diperbarui manual oleh admin — selalu konfirmasi ke pasar setempat sebelum mengambil keputusan jual.`,
    category: "PENGETAHUAN",
    tags: ["harga pasar", "#BALIKMODAL"],
    daysAgo: 7,
  },
  {
    slug: "pelajar-sma-sukses-cabai-greenhouse",
    title: "Muda Penuh Karya: Pelajar SMA Sukses Budidaya Cabai dengan Greenhouse",
    excerpt:
      "Keterbatasan lahan kota bukan halangan. Greenhouse bambu sederhana menjadi model urban farming yang inspiratif.",
    contentMd: `## Greenhouse Bambu Low-Cost\n\nRangka bambu + plastik UV bekas pakai menekan biaya hingga sepertiganya dibanding baja ringan. Ventilasi samping menjaga suhu tetap ideal untuk cabai.\n\n## Hasil\n\nDengan 500 polibag, panen perdana menghasilkan puluhan kilogram yang dijual ke warung sekitar dan tetangga — perputaran kas positif sejak musim pertama.\n\nUrban farming seperti ini bisa direplikasi di pekarangan sekolah maupun rumah.`,
    category: "INSPIRASI",
    tags: ["urban farming", "greenhouse"],
    daysAgo: 8,
  },
];

function randWalk(base: number, day: number): number {
  const wave = Math.sin(day / 3.1) * 0.05 + Math.cos(day / 7.7) * 0.04;
  const noise = ((day * 7919) % 13) / 13 - 0.5; // deterministik
  const drift = (noise * 0.06 + wave) * base;
  return Math.round((base + drift) / 100) * 100;
}

async function main() {
  for (const c of COMMODITIES) {
    await prisma.commodity.upsert({
      where: { name: c.name },
      update: { unit: c.unit },
      create: { name: c.name, unit: c.unit },
    });
  }
  for (const m of MARKETS) {
    await prisma.market.upsert({
      where: { name: m.name },
      update: { city: m.city },
      create: m,
    });
  }

  for (const a of ARTICLES) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        contentMd: a.contentMd,
        category: a.category,
        tags: a.tags,
        publishedAt: new Date(Date.now() - a.daysAgo * 86400000),
      },
    });
  }

  await prisma.price.deleteMany({});
  const commodities = await prisma.commodity.findMany();
  const markets = await prisma.market.findMany();
  const rows: { commodityId: string; marketId: string; price: number; date: Date }[] = [];
  for (const c of commodities) {
    const base = COMMODITIES.find((x) => x.name === c.name)?.base ?? 20000;
    for (const m of markets) {
      const marketAdj = m.name.includes("Kramat") ? 1.12 : m.name.includes("Beringharjo") ? 1.05 : 1;
      for (let d = 29; d >= 0; d--) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - d);
        rows.push({
          commodityId: c.id,
          marketId: m.id,
          price: Math.round(randWalk(base * marketAdj, d) / 50) * 50,
          date,
        });
      }
    }
  }
  // 6 komoditas x 3 pasar x 30 hari = 540 baris
  for (let i = 0; i < rows.length; i += 100) {
    await prisma.price.createMany({ data: rows.slice(i, i + 100) });
  }

  // Info obat (Fase 2)
  for (const o of PESTICIDES) {
    await prisma.pesticide.upsert({ where: { slug: o.slug }, update: {}, create: o });
  }

  // Admin awal (Fase 2). Ganti SEED_ADMIN_PASSWORD di produksi.
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "admin12345";
  await prisma.user.upsert({
    where: { email: "admin@tanimaju.id" },
    update: {},
    create: {
      email: "admin@tanimaju.id",
      name: "Admin TaniMaju",
      role: "ADMIN",
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  console.log(`Seed OK: ${ARTICLES.length} artikel, ${rows.length} harga, ${PESTICIDES.length} obat, 1 admin`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
