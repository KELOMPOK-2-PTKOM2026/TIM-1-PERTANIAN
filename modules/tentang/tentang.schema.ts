import { z } from "zod";

const text = (label: string, max = 300) => z.string().trim().min(1, `${label} wajib diisi`).max(max);

const cardSchema = z.object({
  title: text("Judul kartu", 120),
  description: text("Deskripsi kartu", 400),
});

export const tentangSchema = z.object({
  heroTitle: text("Judul utama", 160),
  heroSubtitle: text("Subjudul", 400),
  heroImageUrl: z.union([z.literal(""), z.url("URL gambar hero tidak valid")]),
  heroBadge: z.string().trim().max(80),
  missionTitle: text("Judul misi", 120),
  missionSubtitle: z.string().trim().max(300),
  missions: z.array(cardSchema).max(9),
  journeyTitle: text("Judul perjalanan", 120),
  journeySubtitle: z.string().trim().max(300),
  journey: z.array(cardSchema.extend({ year: text("Tahun", 20) })).max(12),
  teamTitle: text("Judul anggota", 120),
  teamSubtitle: z.string().trim().max(300),
  team: z
    .array(
      z.object({
        name: text("Nama anggota", 80),
        role: text("Jabatan", 80),
        photoUrl: z.union([z.literal(""), z.url("URL foto anggota tidak valid")]),
      }),
    )
    .max(30),
});

export type TentangContent = z.infer<typeof tentangSchema>;

// Isi bawaan = teks halaman Tentang sebelum bisa diedit dari CMS.
export const DEFAULT_TENTANG: TentangContent = {
  heroTitle: "Membawa Inovasi Teknologi ke Akar Pertanian Indonesia",
  heroSubtitle:
    "Kami berdedikasi memberdayakan petani lokal melalui ekosistem digital terpadu dari sensor tanah presisi hingga akses pasar yang adil dan transparan.",
  heroImageUrl: "https://placehold.co/1200x400/084734/ffffff?text=Tanimaju",
  heroBadge: "Membangun Masa Depan Pertanian",
  missionTitle: "Misi & Dedikasi Tanimaju",
  missionSubtitle:
    "Tanimaju berkomitmen untuk membawa perubahan positif bagi petani Indonesia melalui tiga pilar utama.",
  missions: [
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
      description: "Membangun sistem rantai pasok yang adil dan transparan dari petani hingga konsumen akhir.",
    },
  ],
  journeyTitle: "Perjalanan Tanimaju",
  journeySubtitle: "Langkah-langkah penting dalam perjalanan kami membangun ekosistem pertanian yang lebih baik.",
  journey: [
    {
      year: "2026",
      title: "Awal Mula di Lombok",
      description:
        "Tanimaju berawal dari kepedulian terhadap petani cabai di Lombok yang kesulitan mengakses informasi pertanian.",
    },
    {
      year: "2026",
      title: "Peluncuran di Generasi Petani Generasi 1",
      description: "Meluncurkan program edukasi pertanian digital untuk generasi muda petani di berbagai daerah.",
    },
    {
      year: "2026",
      title: "Ekspansi Layanan Terpadu Nasional",
      description:
        "Memperluas layanan ke seluruh Indonesia dengan platform terpadu untuk petani dan pemangku kepentingan.",
    },
  ],
  teamTitle: "Profil Anggota Tanimaju",
  teamSubtitle: "Orang-orang di balik Tanimaju yang berdedikasi untuk kemajuan pertanian Indonesia.",
  team: [
    { name: "I Ketut Pasek Oka Suntari", role: "Ketua Umum", photoUrl: "" },
    { name: "Muhammad Naufal Azis", role: "Wakil Ketua Umum", photoUrl: "" },
    { name: "Muhammad Alfarizi", role: "Sekretaris", photoUrl: "" },
    { name: "Putu Luh Citra Dewi", role: "Bendahara", photoUrl: "" },
    { name: "I Gede Suardika", role: "Anggota", photoUrl: "" },
    { name: "Rian", role: "Anggota", photoUrl: "" },
  ],
};
