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

// Foto via Special:FilePath Wikimedia Commons (stabil & boleh di-hotlink);
// setiap URL diverifikasi manual (HTTP 200 + content-type image) sebelum masuk sini.
// Produk tanpa imageUrl sengaja disertakan untuk mendemokan fallback placeholder.
const PESTICIDES = [
  {
    slug: "roundup-486-sl",
    name: "Roundup 486 SL",
    type: "HERBISIDA" as const,
    activeIngredient: "Glifosat 486 g/l (isopropilamina)",
    targets: "Gulma berdaun lebar dan rumput tahunan pada lahan olah tanah maupun tanpa olah tanah",
    dosage: "3–5 ml/liter air, semprot merata pada gulma yang aktif tumbuh",
    packaging: "1 liter",
    manufacturer: "Monsanto",
    description:
      "Herbisida sistemik spektrum luas yang bekerja melalui daun hingga ke rizoma. Aplikasi terbaik pagi hari saat gulma dalam fase pertumbuhan aktif; hindari semprotan hanyut ke tanaman budidaya.",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Roundup%20Kanister%202020%2008.JPG?width=800",
    price: 145000,
    phi: "Non-Panen",
    tanamanSasaran: ["Jagung", "Sawit", "Karet", "Lahan Perkebunan"],
  },
  {
    slug: "proclaim-5-sg",
    name: "Proclaim 5 SG",
    type: "INSEKTISIDA" as const,
    activeIngredient: "Emamektin benzoat 5%",
    targets: "Ulat grayak (Spodoptera frugiperda), ulat daun, dan penggerek buah pada sayuran",
    dosage: "0,2–0,4 g/liter air, semprot saat populasi larva muda",
    packaging: "25 g / 50 g",
    manufacturer: "Syngenta",
    description:
      "Insektisida kontak dan lambung untuk pengendalian ulat. Gunakan APD lengkap saat penakaran dan rotasikan bahan aktif tiap 2–3 aplikasi untuk mencegah resistensi.",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Insecticide%20Spray.jpg?width=800",
    price: 87500,
    phi: "7 Hari",
    tanamanSasaran: ["Jagung", "Bawang Merah", "Cabai", "Sayuran Daun"],
  },
  {
    slug: "fipronil-50-sc",
    name: "Fipronil 50 SC",
    type: "INSEKTISIDA" as const,
    activeIngredient: "Fipronil 50 g/l",
    targets: "Penggerek batang padi, kutu daun, wereng batang cokelat, dan semut tanah",
    dosage: "1–1,5 ml/liter air, semprot volume tinggi ke pangkal batang",
    packaging: "100 ml / 250 ml",
    manufacturer: "BASF",
    description:
      "Insektisida fenilpirazol berspektrum luas dengan efek kontak, lambung, dan translaminar. Beracun bagi lebah — jangan aplikasi saat tanaman berbunga dan kunjungan lebah tinggi.",
    imageUrl: "",
    price: 62000,
    phi: "14 Hari",
    tanamanSasaran: ["Padi", "Jagung", "Kedelai"],
  },
  {
    slug: "amistar-top-325-sc",
    name: "Amistar Top 325 SC",
    type: "FUNGISIDA" as const,
    activeIngredient: "Azoksistrobin 200 g/l + Difenokonazol 125 g/l",
    targets: "Antraknosa (patek) pada cabai, blas daun, dan hawar pelepah padi",
    dosage: "0,5–1 ml/liter air, semprot profilaktik saat gejala awal",
    packaging: "100 ml / 250 ml",
    manufacturer: "Syngenta",
    description:
      "Fungisida sistemik berspektrum luas gabungan dua mode aksi (strobilurin + triazol) sehingga efektif sekaligus mengurangi risiko resistensi patogen.",
    imageUrl: "",
    price: 110000,
    phi: "14 Hari",
    tanamanSasaran: ["Padi", "Cabai", "Bawang", "Mangga"],
  },
  {
    slug: "bakar-bordeaux",
    name: "Bakar Bordeaux (Bordeaux Mixture)",
    type: "FUNGISIDA" as const,
    activeIngredient: "Tembaga sulfat + kapur tohor (fungisida kontak tembaga)",
    targets: "Blas daun, antraknosa, dan penyakit bakteri akibat patogen daun pada berbagai tanaman",
    dosage: "Campuran 1–2% disemprotkan atau dioleskan pada luka pangkas",
    packaging: "Serbuk 500 g",
    manufacturer: "",
    description:
      "Fungisida tembaga klasik yang telah dipakai lebih dari seabad, ramah untuk budidaya organik. Jangan dicampur dengan produk berreaksi asam; bilas alat semprot setelah digunakan.",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Calda%20Bordalesa.jpg?width=800",
    price: 35000,
    phi: "3 Hari",
    tanamanSasaran: ["Tomat", "Kentang", "Anggur", "Jeruk"],
  },
  {
    slug: "belerang-80-wp",
    name: "Belerang Pertanian 80 WP",
    type: "AKARISIDA" as const,
    activeIngredient: "Sulfur (belerang) 80%",
    targets: "Tungau merah, tungau rusuk, dan jamur tepung (powdery mildew)",
    dosage: "2–3 g/liter air, semprot pagi hari suhu di bawah 30°C",
    packaging: "1 kg",
    manufacturer: "",
    description:
      "Belerang terapung berfungsi ganda sebagai akarisida dan fungisida. Efektif mengendalikan tungau tanpa merusak musuh alami; hindari aplikasi saat udara panas agar tidak meracuni tanaman.",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Sulfur%20powder%20packaged%20in%20bags.jpg?width=800",
    price: 28000,
    phi: "3 Hari",
    tanamanSasaran: ["Cabai", "Mangga", "Melon", "Anggur"],
  },
  {
    slug: "npk-19-19-19-ws",
    name: "NPK 19-19-19 Water Soluble",
    type: "PUPUK" as const,
    activeIngredient: "N 19% + P2O5 19% + K2O 19% (100% larut air)",
    targets: "Memenuhi kebutuhan makro seimbang pada fase vegetatif menuju generatif",
    dosage: "2–3 g/liter air, disiram ke media atau disemprotkan ke daun tiap 7–10 hari",
    packaging: "1 kg",
    manufacturer: "Oshnic Crop Science",
    description:
      "Pupuk major larut air komposisi seimbang, cocok untuk fertigasi tetes dan penyiraman manual pada hortikultura maupun tanaman pot.",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/NPK%2019-19-19%20Fertilizer%20in%201%20KG%20Commercial%20Packing%20(1).jpg?width=800",
    price: 95000,
    phi: "Non-Pestisida",
    tanamanSasaran: ["Cabai", "Tomat", "Melon", "Bawang"],
  },
  {
    slug: "urea-46",
    name: "Urea 46%",
    type: "PUPUK" as const,
    activeIngredient: "Urea 46% N (amidstik)",
    targets: "Sumber nitrogen ekonomis untuk pertumbuhan vegetatif daun dan batang",
    dosage: "100–200 kg/ha per musim, dibagi 2–3 kali pemberian",
    packaging: "Karung 25 kg",
    manufacturer: "",
    description:
      "Pupuk nitrogen paling banyak dipakai petani Indonesia. Berikan bertahap dan ditutup tanah untuk mengurangi penguapan; jangan diberikan berlebih menjelang masa pembungaan.",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Harnstoff%2001.jpg?width=800",
    price: 155000,
    phi: "Non-Pestisida",
    tanamanSasaran: ["Padi", "Jagung", "Sayuran"],
  },
  {
    slug: "kalsium-nitrat-calcinit",
    name: "Kalsium Nitrat (Calcinit)",
    type: "PUPUK" as const,
    activeIngredient: "N 15,5% + CaO 26% (kalsium nitrat, 100% larut air)",
    targets: "Mencegah busuk ujung buah (blossom-end rot) akibat defisiensi kalsium",
    dosage: "1–2 g/liter air melalui fertigasi atau semprot daun",
    packaging: "Karung 25 kg",
    manufacturer: "Yara",
    description:
      "Pupuk kalsium nitrat bebas klorida untuk fertigasi. Memastikan pasokan kalsium stabil pada fase pembesaran buah sehingga dinding buah kuat dan awet simpan.",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Calcinit%2001.jpg?width=800",
    price: 385000,
    phi: "Non-Pestisida",
    tanamanSasaran: ["Tomat", "Cabai", "Melon", "Strawberi"],
  },
  {
    slug: "pupuk-kandang-matang",
    name: "Pupuk Kandang Matang",
    type: "PUPUK" as const,
    activeIngredient: "Pupuk organik kandang difermentasi (C-organik tinggi)",
    targets: "Perbaikan struktur, drainase, dan biologi tanah sebagai pupuk dasar",
    dosage: "10–15 ton/ha ditebarkan dan dicampur tanah 7–10 hari sebelum tanam",
    packaging: "Karung 20 kg",
    manufacturer: "",
    description:
      "Pupuk kandang sudah difermentasi penuh sehingga bebas patogen tular tanah dan biji gulma. Menyehatkan tanah jangka panjang dan menekan ketergantungan pupuk kimia.",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Compost%20pile.JPG?width=800",
    price: 45000,
    phi: "Non-Pestisida",
    tanamanSasaran: ["Padi", "Sayuran", "Tanaman Buah"],
  },
  {
    slug: "unsur-mikro-kelat",
    name: "Pupuk Unsur Mikro (Trace Elements)",
    type: "LAINNYA" as const,
    activeIngredient: "Mg, Fe, Zn, B, Mn, Cu, Mo (kelat larut air)",
    targets: "Mengatasi defisiensi unsur mikro yang umum pada tanah berpasir dan lahan lama dibudidayakan",
    dosage: "1–2 g/liter air, semprot daun tiap 10–14 hari saat gejala klorosis",
    packaging: "500 g",
    manufacturer: "Manutec",
    description:
      "Suplemen unsur mikro untuk daun hijau merata dan pembungaan optimal. Aman dikombinasikan dengan pupuk daun NPK pada penyemprotan yang sama.",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Fertilizer.jpg?width=800",
    price: 72000,
    phi: "Non-Pestisida",
    tanamanSasaran: ["Sayuran", "Tanaman Buah", "Tanaman Hias"],
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

  // Info obat (Fase 2). Katalog diganti penuh agar re-seed menyegarkan data lama.
  await prisma.pesticide.deleteMany({});
  await prisma.pesticide.createMany({ data: PESTICIDES });

  // Admin awal (Fase 2). SEED_ADMIN_PASSWORD wajib di produksi.
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "admin12345");
  if (adminPassword.length < 12 && process.env.NODE_ENV === "production") {
    throw new Error("SEED_ADMIN_PASSWORD wajib diisi (min 12 karakter) di produksi");
  }
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
