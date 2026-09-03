# PLAN — Website Pertanian (MVP + Fase 2)

Referensi: https://mitrabertani.com/ (Artikel, Produk, Konsultasi Q&A, Jaringan, Event, Testimoni)
Stack kunci: TypeScript + Next.js (React) + PostgreSQL Neon via `DATABASE_URL`
Lokasi: `C:\Users\Jeremi\Documents\TIM-1-PERTANIAN`
Urutan eksekusi MVP: **UIUX → BE → FE**

---

## 1. Pembagian MVP vs Fase 2 (KUNCI)

### MVP — tanpa login sama sekali, 100% publik
1. **Artikel & Edukasi** — `/`, `/artikel`, `/artikel/[slug]`, filter kategori
   `PENGETAHUAN | KIAT | SOLUSI | INSPIRASI`, search judul/tag.
2. **Harga Pasar (data manual)** — `/harga-pasar`: tabel + filter
   komoditas/pasar/tanggal + grafik tren 30 hari. Input manual via
   seed + edit langsung DB (Prisma Studio / Neon dashboard). Tanpa UI `/admin`.
3. **Navbar + placeholder** — menu Fase 2 (Info Obat, Login) tetap tampil dengan badge `Segera`,
   klik → `/segera-hadir?fitur=...` (bukan 404). **Konsultasi TIDAK ada di navbar publik** —
   hanya tersedia di dashboard setelah login (Fase 2).

### Fase 2 — tertulis di sini, TIDAK di-code di MVP
1. **Auth** — register/login/logout, role `ADMIN | PAKAR | PETANI` (Auth.js v5 + PrismaAdapter).
2. **Admin UI** — `/admin/harga`, `/admin/artikel`, `/admin/obat` (guard ADMIN).
3. **Konsultasi (wajib login, HANYA di dashboard — tidak di navbar publik)** —
   route `/dashboard/konsultasi`: form (Nama, Kota, WA, Topik: Budidaya/Hama/Pestisida/Pemupukan,
   Pertanyaan) + riwayat pertanyaan milik sendiri; arsip Q&A publik yang sudah dijawab tampil di
   `/dashboard/konsultasi/arsip`. Meniru `/konsultasi` mitrabertani.
4. **Info Obat-obatan** — pengelompokan `HERBISIDA | INSEKTISIDA | FUNGISIDA | AKARISIDA`.
   Per obat: nama dagang, bahan aktif, target + tanaman cocok, dosis & aturan pakai,
   keamanan (APD, PHI/interval panen), box **Rekomendasi** (link ke Artikel Solusi + Konsultasi).
   Routes: `/obat`, `/obat/jenis/[jenis]`, `/obat/[slug]`.
5. **Sisa mitrabertani:** Katalog Produk, Testimoni, Event, Jaringan.

---

## 2. Per Role — UIUX

### MVP
- Wireframe mobile-first (320px): Home, Artikel list/detail, Harga (tabel+filter+grafik),
  Navbar (active vs `soon`), `/segera-hadir`, states loading/empty/error.
- Visual: palette hijau pertanian, tipografi besar, target sentuh ≥44px,
  badge `Segera`, `aria-disabled=true` pada menu soon, tooltip "Segera hadir di Fase 2".
- AC: kontras AA, tidak ada link mati, lolos cek 320px & 768px.

### Fase 2
- Flow Login/Register → Dashboard, form Konsultasi (di dashboard) + status OPEN/ANSWERED, kartu Obat + badge jenis,
  tabel Admin (CRUD), empty-state "belum ada jawaban".

## 3. Per Role — FE (Next.js App Router + TS + Tailwind)

### MVP
- Routes: `/`, `/artikel`, `/artikel/[slug]`, `/harga-pasar`, `/segera-hadir`.
- Komponen: `Navbar(status: active|soon)`, `ArticleCard`, `CategoryFilter`,
  `SearchInput`, `PriceTable+Filter`, `TrendChart (recharts)`, `BadgeSegera`.
- Data: Server Component read-only dari `lib/data.ts` (mock) → gampang swap ke Prisma
  saat `DATABASE_URL` Neon tersedia. ISR 60s untuk harga.
- Tipe nav:
  ```ts
  type NavItem = { label: string; href: string; status: "active" | "soon"; children?: NavItem[] };
  ```
  `soon` → Link ke `/segera-hadir?fitur=...` + badge + `cursor-not-allowed`.
- AC: `npm run build` hijau, Lighthouse mobile ≥85, semua menu soon ke placeholder.

### Fase 2
- Routes: `/login`, `/register`, `/dashboard` (layout + guard login),
  `/dashboard/konsultasi` (form + riwayat + arsip Q&A — TIDAK ada di navbar publik),
  `/obat`, `/obat/jenis/[jenis]`, `/obat/[slug]`, `/(admin)/admin/*`.
- Auth client Auth.js, form via Server Actions + Zod, guard middleware `/admin`.

## 4. Per Role — BE (Prisma + Neon Postgres)

### MVP — migrasi 001 (tanpa User/Auth)
```prisma
model Article {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  excerpt     String
  contentMd   String   @db.Text
  coverUrl    String?
  category    ArticleCategory
  tags        String[]
  publishedAt DateTime?
  views       Int      @default(0)
  createdAt   DateTime @default(now())
}
enum ArticleCategory { PENGETAHUAN KIAT SOLUSI INSPIRASI }

model Commodity { id String @id @default(cuid()); name String @unique; unit String @default("kg"); prices Price[] }
model Market    { id String @id @default(cuid()); name String @unique; city String; prices Price[] }
model Price {
  id String @id @default(cuid()); commodityId String; marketId String
  price Int; date DateTime @db.Date
  commodity Commodity @relation(fields: [commodityId], references: [id])
  market    Market    @relation(fields: [marketId], references: [id])
  @@index([commodityId, marketId, date])
}
```
- Seed MVP: 6 komoditas (Cabai Rawit, Cabai Merah Keriting, Bawang Merah, Padi, Tomat, Melon),
  3 pasar, 8 artikel, ±30 harga. Env: `DATABASE_URL` (Neon pooling), `DIRECT_URL` (migrate).
- AC: `prisma migrate dev` hijau, harga terurut per tanggal, slug unik.

### Fase 2 — migrasi 002
```prisma
model User { id, email @unique, passwordHash, role: ADMIN|PAKAR|PETANI, name, city, whatsapp?, createdAt }
model Consultation { id, userId, topic: BUDIDAYA|HAMA|PESTISIDA|PEMUPUKAN, question @db.Text, answer @db.Text?, answeredById?, status: OPEN|ANSWERED, createdAt }
model Pesticide { id, slug @unique, name, type: HERBISIDA|INSEKTISIDA|FUNGISIDA|AKARISIDA, bahanAktif, target String[], tanamanCocok String[], dosis, caraPakai @db.Text, keamanan @db.Text, rekomendasi @db.Text?, coverUrl?, isPublished, createdById }
```
- Seed Fase 2: 8–12 pesticide (2–3 per jenis), 1 admin, contoh konsultasi.
- API: `GET /api/harga?komoditas&pasar&from&to`.

---

## 5. Urutan Kerja

1. UIUX wireframe MVP → 2. BE schema+seed → 3. FE publik → 4. Navbar `Segera` →
   5. Verifikasi (`npm run dev`, filter+grafik, build) → 6. Backlog Fase 2 per role.

## 6. Verifikasi MVP
- `npm run dev` → `/`, `/artikel`, `/harga-pasar`, `/segera-hadir?fitur=konsultasi` render 200.
- Filter kategori artikel + filter harga + grafik tren jalan dengan data seed.
- `npm run build` sukses tanpa `DATABASE_URL` (mode mock).
