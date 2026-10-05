# TaniMaju — Website Pertanian

Website pertanian untuk petani Indonesia: edukasi budidaya + pantau harga pasar sebelum jual
panen. MVP publik tanpa login; Fase 2 menambah akun, konsultasi pakar, info obat, dan admin.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 · Prisma 6 + PostgreSQL
Neon · Auth.js v5 (Credentials) · zod · recharts.

## Status Fitur

| Route | Status | Catatan |
|---|---|---|
| `/` | ✅ | Beranda |
| `/artikel`, `/artikel/[slug]` | ✅ | List + detail, filter kategori + search |
| `/harga-pasar` | ✅ | `HargaExplorer` + `TrendChart` (tren 30 hari) |
| `/segera-hadir?fitur=...` | ✅ | Placeholder fitur Fase 2 |
| `/login` | ✅ | Email + password, redirect ke `/dashboard` |
| Logout | ✅ | Tombol di nav dashboard |
| `/register` | 🚧 | UI stub; backend `registerAction` sudah siap |
| `/dashboard`, `/dashboard/konsultasi`, `/arsip` | 🚧 | Wajib login (guard aktif), isi masih stub |
| `/admin/harga`, `/artikel`, `/obat` | 🚧 | Wajib role ADMIN (guard aktif), CRUD masih stub |
| `/obat`, `/obat/jenis/[jenis]`, `/obat/[slug]` | 🚧 | Stub Info Obat |
| `GET /api/harga` | 🚧 | Masih return `[]` |

## Struktur Folder

```
app/
  layout.tsx                        # font + metadata
  page.tsx                          # beranda
  (public)/layout.tsx               # Navbar + Footer
  (public)/artikel/ + [slug]/
  (public)/harga-pasar/
  (public)/obat/ + jenis/[jenis]/ + [slug]/   # stub
  (public)/segera-hadir/
  (auth)/layout.tsx                 # layout polos tanpa Navbar
  (auth)/login/                     # LoginForm
  (auth)/register/                  # stub UI
  dashboard/layout.tsx              # requireUser() + Logout
  dashboard/konsultasi/ + arsip/    # stub
  admin/layout.tsx                  # requireRole("ADMIN")
  admin/harga|artikel|obat/         # stub CRUD
  api/auth/[...nextauth]/route.ts   # handler Auth.js
  api/harga/route.ts                # stub
proxy.ts                            # cek optimistis /dashboard + /admin (Next 16: middleware → proxy)
modules/
  auth/                             # schema, service, actions, guard, types
  artikel|harga|konsultasi|obat/    # belum diisi
lib/
  auth.ts                           # konfigurasi NextAuth (Credentials, JWT)
  db.ts                             # Prisma client (null bila tanpa DATABASE_URL)
  data.ts                           # query artikel/harga, fallback ke mock
  mock.ts  format.ts  env.ts  errors.ts
components/
  Navbar.tsx  Footer.tsx  ArticleCard.tsx  Markdown.tsx
  HargaExplorer.tsx  TrendChart.tsx  logo tanimaju.png  icon sign-in.png
  features/auth/LoginForm.tsx
  ui/                               # belum diisi
prisma/
  schema.prisma  seed.ts  migrations/
```

- Route group `(...)` tidak mengubah URL (`/artikel` tetap `/artikel`).
- `modules/<domain>/` = schema (zod) + service + actions per domain. Tanpa repository layer —
  Prisma sudah jadi repository.

## Auth

Alur login: `LoginForm` → `loginAction` (validasi zod) → `signIn("credentials")` →
`authorize` di `lib/auth.ts` → `authenticate` (bcrypt) di `modules/auth/auth.service.ts` →
session JWT berisi `id` + `role`.

- Role: `ADMIN | PAKAR | PETANI` (default `PETANI`).
- Guard 2 lapis: `proxy.ts` (redirect cepat) + `requireUser` / `requireRole` di layout
  (`modules/auth/auth.guard.ts`). Guard selalu di server, jangan cuma sembunyikan UI.
- `callbackUrl` hanya menerima path internal (cegah open redirect).

## Database

Model: `Article`, `Commodity`, `Market`, `Price`, `User` + enum `ArticleCategory`, `Role`.
Seed mengisi 8 artikel, 6 komoditas × 3 pasar × 30 hari harga, dan 1 admin.

Tanpa `DATABASE_URL` → halaman publik memakai data contoh di `lib/mock.ts` dan `npm run build`
tetap hijau. Login butuh database.

## Environment

| Variabel | Wajib | Keterangan |
|---|---|---|
| `DATABASE_URL` | untuk DB | Connection string Neon |
| `AUTH_SECRET` | ya (auth) | `npx auth secret`. Kosong → login error "server configuration" |
| `SEED_ADMIN_PASSWORD` | tidak | Password admin seed, default `admin12345` |

## Getting Started

1. Salin `.env.example` → `.env`, isi variabel di atas.
2. Migrate + seed:

```bash
npx prisma migrate dev
```

```bash
npm run db:seed
```

3. Jalankan:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Akun admin dev: `admin@tanimaju.id` /
`admin12345`.

Scripts: `dev`, `build`, `start`, `lint`, `db:seed`.

Verifikasi:

- `/`, `/artikel`, `/harga-pasar` render 200
- `/dashboard` tanpa login → redirect `/login`; login admin → `/dashboard`, `/admin/harga` bisa dibuka
- `npm run build` hijau

## Aturan

1. Server Component default, client hanya island (HargaExplorer, TrendChart, Navbar, Form).
2. Validasi di `modules/*/*.schema.ts` + Server Action; guard server-side.
3. Tanpa `DATABASE_URL` → mock, build tetap hijau.
4. Konsultasi TIDAK ada di navbar publik — hanya di dashboard setelah login.

## Commit & Branch

Commit pakai Conventional Commits: `<tipe>: <penjelasan singkat>`.

| Tipe | Pakai untuk |
|---|---|
| `feat` | Fitur/route baru |
| `fix` | Perbaikan bug |
| `refactor` | Restruktur tanpa ubah perilaku |
| `chore` | Scaffold, tooling, dependency |
| `docs` | README, PLAN, PRD |
| `style` | Format/visual tanpa logika |
| `test` | Test |

Contoh: `feat: halaman login sederhana`, `docs: README auth email+password`.

Branch: `<tipe>/<nama>/<penjelasan-singkat>`, mis. `feat/jeremi/auth-credentials`.
1 branch = 1 tujuan, huruf kecil + strip, hapus branch setelah merge.

## TODO Berikutnya

- Navbar: tombol Sign In/Login masih ke `/segera-hadir?fitur=login` → arahkan ke `/login`, dan
  tampilkan Dashboard/Logout saat sudah login.
- UI `/register` (pakai `registerAction`).
- Modul `konsultasi`, `obat`, `harga` + isi `GET /api/harga`.
- CRUD admin (harga, artikel, obat).
- Panggil `assertAuthEnv()` (`lib/env.ts`) saat startup.
- Isi `components/ui/` (Button, Input, Badge, EmptyState).
