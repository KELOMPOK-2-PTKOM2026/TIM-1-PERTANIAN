# PRD — Website Pertanian TaniMaju (MVP + Fase 2)

> **Status:** Draft v1.0 — 3 Sep 2026
> **Sumber:** `PLAN.MD` + implementasi MVP saat ini (`app/`, `components/`, `lib/`, `prisma/`)
> **Referensi:** https://mitrabertani.com/ (Artikel, Produk, Konsultasi Q&A, Jaringan, Event, Testimoni)
> **Stack:** TypeScript + Next.js App Router + Tailwind + Prisma + PostgreSQL Neon (`DATABASE_URL`)
> **Lokasi repo:** `C:\Users\Jeremi\Documents\TIM-1-PERTANIAN` (root repo = root Next.js)

---

## 1. Ringkasan Eksekutif

Membangun website pertanian publik berbahasa Indonesia untuk petani: **edukasi budidaya + pantau harga pasar sebelum jual panen**. MVP 100% publik tanpa login. Fase 2 menambah akun, konsultasi pakar (di dashboard, wajib login), info obat-obatan, dan admin UI.

Prinsip MVP: **UIUX → BE → FE**, data read-only via Server Component, fallback mock agar `npm run build` tetap hijau tanpa `DATABASE_URL`.

## 2. Latar Belakang & Masalah

Petani kesulitan: (1) info budidaya tersebar/tidak terstruktur, (2) harga jual tidak transparan antar pasar, (3) konsultasi hama/penyakit lambat, (4) info obat (bahan aktif, dosis, keamanan) tidak lengkap. Mitrabertani.com memvalidasi kebutuhan: artikel edukasi, harga/produk, konsultasi Q&A, jaringan, event, testimoni.

## 3. Tujuan & Success Metrics

| Tujuan | Metric | Target |
|---|---|---|
| Edukasi mudah diakses | Artikel terbit + terbaca mobile | 8 artikel seed, Lighthouse mobile ≥ 85 |
| Transparansi harga | Filter + grafik dipakai | Filter komoditas/pasar jalan, tren 30 hari render |
| Tanpa link mati | Semua menu soon → placeholder | 100% menu `soon` ke `/segera-hadir?fitur=...`, bukan 404 |
| Build stabil | CI/dev lokal | `npm run dev` 200 di `/`, `/artikel`, `/harga-pasar`, `/segera-hadir`; `npm run build` hijau tanpa `DATABASE_URL` |
| Siap Fase 2 | Skema + nav extensible | Migrasi 001 tanpa User; nav `active\|soon` tidak perlu refactor saat Auth masuk |

## 4. Persona & Role

| Persona | MVP | Fase 2 |
|---|---|---|
| **Pengunjung / Petani umum** | Baca artikel, cek harga, lihat badge Segera | Daftar/login, tanya di dashboard, baca arsip Q&A, baca info obat |
| **Pakar** | — (belum ada) | Jawab konsultasi (`answeredById`), tulis rekomendasi obat |
| **Admin** | Input manual via seed / Prisma Studio / Neon dashboard (tanpa UI) | CRUD via `/admin/*` (guard `ADMIN`) |

## 5. Scope

### 5.1 MVP — IN (100% publik, tanpa login)

1. **Artikel & Edukasi** — `/`, `/artikel`, `/artikel/[slug]`, filter kategori `PENGETAHUAN | KIAT | SOLUSI | INSPIRASI`, search judul/tag.
2. **Harga Pasar (data manual)** — `/harga-pasar`: kartu harga terakhir + filter komoditas/pasar + grafik tren 30 hari + tabel 14 hari. Input manual via seed/edit DB langsung. Tanpa UI `/admin`.
3. **Navbar + placeholder** — menu Fase 2 (`Info Obat`, `Login`) tetap tampil badge `Segera`, klik → `/segera-hadir?fitur=...`. **Konsultasi TIDAK ada di navbar publik.**

### 5.2 Fase 2 — IN (tidak di-code di MVP, didesain di PRD ini)

1. **Auth** — register/login/logout, role `ADMIN | PAKAR | PETANI` (Auth.js v5 + PrismaAdapter).
2. **Admin UI** — `/admin/harga`, `/admin/artikel`, `/admin/obat` (guard ADMIN).
3. **Konsultasi (wajib login, HANYA di dashboard)** — `/dashboard/konsultasi`: form (Nama, Kota, WA, Topik: Budidaya/Hama/Pestisida/Pemupukan, Pertanyaan) + riwayat milik sendiri; arsip Q&A terjawab di `/dashboard/konsultasi/arsip`.
4. **Info Obat** — grouping `HERBISIDA | INSEKTISIDA | FUNGISIDA | AKARISIDA`. Per obat: nama dagang, bahan aktif, target + tanaman cocok, dosis & aturan pakai, keamanan (APD, PHI/interval panen), box **Rekomendasi** (link Artikel Solusi + Konsultasi). Routes: `/obat`, `/obat/jenis/[jenis]`, `/obat/[slug]`.
5. **Backlog sisa mitrabertani:** Katalog Produk, Testimoni, Event, Jaringan.

### 5.3 OUT OF SCOPE

MVP: login/register, dashboard, konsultasi publik, `/admin/*`, API publik, upload gambar, notifikasi WA/email, multi-bahasa, payment. Fase 2: marketplace transaksi, mobile app native.

## 6. Informasi Arsitektur & Navigasi

```
MVP publik:
 / → hero + Jelajahi Topik (4 kategori) + Harga Hari Ini (4 kartu) + Artikel Terbaru (4) + CTA konsultasi → /segera-hadir
 /artikel?kategori=&q= → search + filter pills + grid ArticleCard + empty-state
 /artikel/[slug] → judul, meta (kategori/tag/tanggal/views), konten markdown, artikel terkait
 /harga-pasar → HargaExplorer (2 dropdown + kartu terakhir + TrendChart + tabel)
 /segera-hadir?fitur=konsultasi|obat|obat-*|login|admin → badge SEGERA HADIR + CTA balik

Fase 2 (baru):
 /login, /register → /dashboard (layout + guard)
 /dashboard/konsultasi, /dashboard/konsultasi/arsip (TIDAK di navbar publik)
 /obat, /obat/jenis/[jenis], /obat/[slug]
 /(admin)/admin/{harga,artikel,obat}
```

Tipe nav (sudah diimplementasi di `components/Navbar.tsx`):

```ts
type NavItem = { label: string; href: string; status: "active" | "soon"; fitur?: string; children?: NavItem[] };
```

Aturan: `soon` → Link ke `/segera-hadir?fitur=...`, tampil `SoonBadge`, `aria-disabled=true`, `title="Segera hadir di Fase 2"`, `cursor-not-allowed`. Info Obat punya 4 children (Herbisida/Insektisida/Fungisida/Akarisida), semua `soon`.

## 7. Functional Requirements — MVP

### F-MVP-01 Home (`app/page.tsx`)
- **Story:** Sebagai petani, saya mau gambaran cepat harga + edukasi di satu halaman.
- **Req:** Hero (2 CTA: Cek Harga Pasar, Baca Artikel), grid 4 kategori → `/artikel?kategori=`, 4 kartu harga terakhir (nama, Rp/kg, tanggal), 4 artikel terbaru, CTA konsultasi → `/segera-hadir?fitur=konsultasi` dengan teks Fase 2.
- **AC:** ISR 60s; 4 section render dengan data mock maupun DB; tidak ada fetch client-side untuk konten awal.

### F-MVP-02 Daftar artikel (`app/artikel/page.tsx`)
- **Story:** Sebagai petani, saya mau filter + cari artikel.
- **Req:** Query `?kategori=SEMUA|...&q=`; pills kategori (Semua + 4 label: Info & Wawasan, Kiat Pertanian, Solusi Masalah, Berita Inspirasi); form search GET (placeholder "Cari: thrips, pupuk, bedengan…"); kategori invalid → fallback SEMUA; empty-state "Tidak ada artikel yang cocok…".
- **AC:** Filter kategori + search judul/tag (case-insensitive) jalan di mock dan Prisma; urut `publishedAt` desc.

### F-MVP-03 Detail artikel (`app/artikel/[slug]/`)
- **Story:** Sebagai petani, saya mau baca solusi lengkap per masalah.
- **Req:** Render `contentMd` via `components/Markdown.tsx`; tampilkan excerpt, tags, views; slug unik; 404 bila slug tidak ada.
- **AC:** `getArticleSlugs()` untuk static params; konten seed 8 artikel sesuai `prisma/seed.ts`.

### F-MVP-04 Harga pasar (`app/harga-pasar/page.tsx` + `HargaExplorer.tsx` + `TrendChart.tsx`)
- **Story:** Sebagai petani, saya mau bandingkan harga per pasar + lihat tren sebelum jual.
- **Req:** Dropdown Komoditas (6: Cabai Rawit, Cabai Merah Keriting, Bawang Merah, Tomat, Melon, Beras Medium) + Pasar (3: Muntilan-Magelang, Beringharjo-Yogyakarta, Kramat Jati-Jaktim); kartu harga terakhir + selisih vs kemarin (▲/▼); grafik garis 30 hari (recharts, Y-axis `rb`); tabel 14 hari (Tanggal/Harga/Perubahan); banner amber "Mode contoh" saat `!DATABASE_URL`.
- **AC:** Default komoditas+pasar pertama; kombinasi kosong → "Tidak ada data untuk kombinasi ini."; grafik kosong → "Tidak ada data untuk grafik."; ISR 60s.

### F-MVP-05 Segera-hadir (`app/segera-hadir/page.tsx`)
- **Story:** Sebagai pengunjung, saya tidak mau kena 404 saat klik fitur masa depan.
- **Req:** Mapping `fitur` → konsultasi, obat, obat-herbisida/insektisida/fungisida/akarisida, login, admin + fallback generik; tampil badge + judul + desc + label fase + 3 CTA (Artikel, Harga, Beranda).
- **AC:** Semua `href` soon di navbar mengarah ke sini dan render 200.

### F-MVP-06 Data layer (`lib/data.ts`, `lib/mock.ts`, `lib/db.ts`)
- **Story:** Sebagai dev, saya mau swap mock → Neon tanpa ubah UI.
- **Req:** `getArticles`, `getArticleBySlug`, `getArticleSlugs`, `getCommodities`, `getMarkets`, `getPrices({commodityId,marketId,from,to})`; coba Prisma dulu, catch → mock; `isMockMode() = !DATABASE_URL`; harga DB `take: 2000`, urut tanggal asc.
- **AC:** Build hijau tanpa env; seed 540 baris harga (6×3×30) via `prisma/seed.ts`.

## 8. Functional Requirements — Fase 2

### F-P2-01 Auth
- Register/login/logout (Auth.js v5 + PrismaAdapter), hash password, session, role `ADMIN|PAKAR|PETANI`. Guard: `/dashboard/*` wajib login; `/admin/*` wajib ADMIN (middleware). Navbar `Login` berubah jadi `Dashboard/Logout` saat login.

### F-P2-02 Konsultasi dashboard
- Form: Nama, Kota, WA (validasi format ID), Topik (`BUDIDAYA|HAMA|PESTISIDA|PEMUPUKAN`), Pertanyaan (textarea, min 20 char). Server Action + Zod. Riwayat milik sendiri + status `OPEN|ANSWERED`; empty-state "belum ada jawaban". Arsip publik terjawab di `/dashboard/konsultasi/arsip` (read-only). Pakar mengisi `answer + answeredById`, status → ANSWERED.

### F-P2-03 Info obat
- List `/obat` (filter 4 jenis + search nama/bahan aktif/target) → kartu (nama, badge jenis, bahan aktif, tanaman cocok). Detail `/obat/[slug]`: dosis, cara pakai, keamanan (APD, PHI), box Rekomendasi (link Artikel SOLUSI + CTA konsultasi). `/obat/jenis/[jenis]` untuk SEO per jenis. `isPublished=false` → hidden publik, visible admin.

### F-P2-04 Admin UI
- Tabel CRUD: Harga (komoditas/pasar/tanggal/harga, bulk insert harian), Artikel (slug auto, markdown editor, publish/unpublish), Obat (semua field F-P2-03 + publish). Validasi Zod, audit `createdById`. Tanpa admin UI di MVP — Fase 2 wajib.

### F-P2-05 API
- `GET /api/harga?komoditas&pasar&from&to` → JSON `[{date,price,commodity,market}]`, max 2000, cache 60s. Untuk grafik embed / integrasi.

## 9. Model Data

### Migrasi 001 — MVP (sudah di `prisma/schema.prisma`)
`Article(id, slug unique, title, excerpt, contentMd text, coverUrl?, category enum, tags String[], publishedAt?, views default 0, createdAt)` + index `(category, publishedAt)`; `Commodity(id, name unique, unit default kg)`; `Market(id, name unique, city)`; `Price(id, commodityId, marketId, price Int Rp, date Date, createdAt)` + index `(commodityId, marketId, date)`, cascade delete.

### Migrasi 002 — Fase 2 (belum di-code)
```prisma
enum Role { ADMIN PAKAR PETANI }
enum Topic { BUDIDAYA HAMA PESTISIDA PEMUPUKAN }
enum ObatJenis { HERBISIDA INSEKTISIDA FUNGISIDA AKARISIDA }
enum KonsultStatus { OPEN ANSWERED }
model User { id, email unique, passwordHash, role, name, city, whatsapp?, createdAt }
model Consultation { id, userId, topic, question text, answer text?, answeredById?, status, createdAt }
model Pesticide { id, slug unique, name, type, bahanAktif, target String[], tanamanCocok String[], dosis, caraPakai text, keamanan text, rekomendasi text?, coverUrl?, isPublished, createdById }
```
Seed Fase 2: 8–12 pesticide (2–3/jenis), 1 admin, contoh konsultasi.

## 10. Non-Functional Requirements

- Performa: Server Component + ISR 60s; `TrendChart`/`HargaExplorer` client island; Lighthouse mobile ≥ 85.
- Aksesibilitas: kontras AA, target sentuh ≥ 44px, `aria-disabled` + tooltip pada menu soon, `role=tablist` filter, semantic table.
- Responsif: mobile-first 320px, cek 320px & 768px (wireframe: Home, list/detail artikel, harga, navbar, segera-hadir, loading/empty/error).
- Keamanan (Fase 2): hash password, guard server-side (jangan hanya hide UI), validasi Zod di Server Action, rate-limit form konsultasi.
- Operasional MVP: tanpa `DATABASE_URL` → mock; dengan Neon → `DATABASE_URL` pooling + `DIRECT_URL` untuk migrate; `prisma migrate dev` hijau; slug unik; harga terurut per tanggal.

## 11. UX/UI

Palette hijau pertanian (`tani-*`) + aksen pasar (`pasar-*`), tipografi besar (H1 3xl–5xl), kartu rounded-xl, badge amber `Segera`/`SEGERA HADIR · FASE 2`. States: loading, empty ("Tidak ada…"), error, banner mock amber. Ilustrasi/ikon emoji sementara (🌾📚🌱🩺✨) — ganti SVG saat polish.

## 12. Verifikasi & Milestone

- **MVP done jika:** `npm run dev` → `/`, `/artikel`, `/harga-pasar`, `/segera-hadir?fitur=konsultasi` 200; filter kategori + search + filter harga + grafik jalan dengan seed; `npm run build` sukses tanpa `DATABASE_URL`; tidak ada link mati.
- **Urutan kerja (PLAN.MD):** 1 wireframe → 2 schema+seed → 3 FE publik → 4 navbar Segera → 5 verifikasi → 6 backlog Fase 2.
- **Fase 2 done jika:** register→login→tanya→dijawab→arsip tampil; CRUD admin guard ADMIN; obat per jenis + rekomendasi link balik ke artikel/konsultasi; `GET /api/harga` 200.

## 13. Risiko, Asumsi, Pertanyaan Terbuka

- **Risiko:** harga manual basi → mitigasi banner "konfirmasi ke pasar setempat" + banner mock; konten obat sensitif (dosis/PHI) → wajib review Pakar + sumber label; spam konsultasi → login + rate-limit + moderasi.
- **Asumsi:** 6 komoditas + 3 pasar cukup untuk validasi; Auth.js v5 stabil dengan PrismaAdapter; Neon pooling cukup untuk ISR.
- **Open:** (1) Sumber harga produksi: tetap manual admin atau integrasi API pemda? (2) Apakah arsip konsultasi boleh publik tanpa login (SEO) atau tetap di dashboard? (3) Butuh upload foto hama di form konsultasi? (4) Katalog Produk prioritas ke berapa di Fase 2?

## Lampiran — Traceability MVP

| PRD | Implementasi |
|---|---|
| F-MVP-01 | `app/page.tsx`, `components/ArticleCard.tsx`, `components/Navbar.tsx`, `components/Footer.tsx` |
| F-MVP-02/03 | `app/artikel/page.tsx`, `app/artikel/[slug]/`, `components/Markdown.tsx`, `lib/data.ts: getArticles` |
| F-MVP-04 | `app/harga-pasar/page.tsx`, `components/HargaExplorer.tsx`, `components/TrendChart.tsx`, `lib/format.ts` |
| F-MVP-05 | `app/segera-hadir/page.tsx`, `components/Navbar.tsx: NAV_ITEMS` |
| F-MVP-06 | `lib/data.ts`, `lib/mock.ts`, `lib/db.ts`, `prisma/schema.prisma`, `prisma/seed.ts`, `.env.example` |
