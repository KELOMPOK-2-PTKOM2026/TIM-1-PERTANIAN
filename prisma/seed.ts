import { PrismaClient, ArticleCategory, type Prisma } from "@prisma/client";
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

  // Admin awal (Fase 2). Ganti SEED_ADMIN_PASSWORD di produksi.
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "admin12345";
  const admin = await prisma.user.upsert({
    where: { email: "admin@tanimaju.id" },
    update: {},
    create: {
      email: "admin@tanimaju.id",
      name: "Admin TaniMaju",
      role: "ADMIN",
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  // Seed obat (Fase 2): 8 item, 2 per jenis.
  const PESTICIDES: Omit<Prisma.PesticideUncheckedCreateInput, "createdById">[] = [
    {
      slug: "sidazin-550-sc",
      name: "Sidazin 550 SC",
      type: "HERBISIDA",
      bahanAktif: "Atrazin 550 g/l",
      target: ["gulma berdaun lebar", "teki"],
      tanamanCocok: ["Jagung"],
      dosis: "1,5–2 ml/l air",
      caraPakai: "Semprot merata pada gulma muda pagi hari.",
      keamanan: "Gunakan APD lengkap. PHI 30 hari sebelum panen.",
      rekomendasi: "Lihat artikel olah lahan sebelum aplikasi.",
    },
    {
      slug: "gramati-280-sl",
      name: "Gramati 280 SL",
      type: "HERBISIDA",
      bahanAktif: "Paraquat diklorida 280 g/l",
      target: ["gulma total"],
      tanamanCocok: ["Semua (pra-tanam)"],
      dosis: "2–3 ml/l air",
      caraPakai: "Semprot tanpa mengenai tanaman pokok.",
      keamanan: "Sangat beracun. APD penuh, jauhkan dari anak-anak.",
      rekomendasi: null,
    },
    {
      slug: "abacel-18-ec",
      name: "Abacel 18 EC",
      type: "INSEKTISIDA",
      bahanAktif: "Abamektin 18 g/l",
      target: ["thrips", "tungau"],
      tanamanCocok: ["Cabai", "Tomat"],
      dosis: "0,5–1 ml/l air",
      caraPakai: "Semprot bawah daun sore hari, rotasi tiap 2–3 aplikasi.",
      keamanan: "Gunakan masker dan sarung tangan. PHI 7 hari.",
      rekomendasi: "Lihat artikel daun cabai keriting akibat thrips.",
    },
    {
      slug: "spintor-120-sc",
      name: "Spintor 120 SC",
      type: "INSEKTISIDA",
      bahanAktif: "Spinetoram 120 g/l",
      target: ["thrips", "ulat grayak"],
      tanamanCocok: ["Cabai", "Bawang Merah"],
      dosis: "0,5 ml/l air",
      caraPakai: "Semprot pagi/sore, maksimal 3 aplikasi per musim.",
      keamanan: "APD standar. PHI 5 hari.",
      rekomendasi: null,
    },
    {
      slug: "dithane-m45",
      name: "Dithane M-45",
      type: "FUNGISIDA",
      bahanAktif: "Mankozeb 80%",
      target: ["bercak daun", "busuk batang"],
      tanamanCocok: ["Cabai", "Tomat", "Melon"],
      dosis: "2 g/l air",
      caraPakai: "Semprot preventif tiap 7 hari di musim hujan.",
      keamanan: "Gunakan APD. PHI 14 hari.",
      rekomendasi: "Lihat artikel olah lahan musim hujan.",
    },
    {
      slug: "amistar-top",
      name: "Amistar Top",
      type: "FUNGISIDA",
      bahanAktif: "Azoksistrobin + difenokonazol",
      target: ["antraknosa", "layu"],
      tanamanCocok: ["Cabai"],
      dosis: "1 ml/l air",
      caraPakai: "Semprot kuratif saat gejala awal muncul.",
      keamanan: "APD standar. PHI 7 hari.",
      rekomendasi: null,
    },
    {
      slug: "samite-135-ec",
      name: "Samite 135 EC",
      type: "AKARISIDA",
      bahanAktif: "Piridaben 135 g/l",
      target: ["tungau merah"],
      tanamanCocok: ["Cabai", "Melon"],
      dosis: "1 ml/l air",
      caraPakai: "Semprot bawah daun, ulangi 7 hari bila perlu.",
      keamanan: "APD lengkap. PHI 10 hari.",
      rekomendasi: null,
    },
    {
      slug: "omite-570-ew",
      name: "Omite 570 EW",
      type: "AKARISIDA",
      bahanAktif: "Propargit 570 g/l",
      target: ["tungau"],
      tanamanCocok: ["Tomat", "Cabai"],
      dosis: "1–1,5 ml/l air",
      caraPakai: "Semprot merata sore hari.",
      keamanan: "APD lengkap. PHI 14 hari.",
      rekomendasi: null,
    },
  ];
  for (const p of PESTICIDES) {
    await prisma.pesticide.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, createdById: admin.id },
    });
  }

  // Contoh konsultasi: 1 OPEN + 1 ANSWERED.
  const petani = await prisma.user.upsert({
    where: { email: "petani@tanimaju.id" },
    update: {},
    create: {
      email: "petani@tanimaju.id",
      name: "Petani Contoh",
      role: "PETANI",
      passwordHash: await bcrypt.hash("petani12345", 10),
    },
  });
  await prisma.consultation.createMany({
    data: [
      {
        userId: petani.id,
        topic: "HAMA",
        question: "Daun cabai saya keriting ke atas dan kaku, apakah ini thrips dan apa obatnya?",
        status: "ANSWERED",
        answer: "Ya, itu gejala thrips. Semprot abamektin 0,5–1 ml/l sore hari mengenai bawah daun, pasang perangkap kuning.",
        answeredById: admin.id,
      },
      {
        userId: petani.id,
        topic: "PEMUPUKAN",
        question: "Berapa dosis pupuk kandang fermentasi yang aman untuk bedengan cabai musim hujan?",
        status: "OPEN",
      },
    ],
    skipDuplicates: true,
  });

  console.log(
    `Seed OK: ${ARTICLES.length} artikel, ${rows.length} harga, 1 admin, ${PESTICIDES.length} obat`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
