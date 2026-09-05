# TaniMaju — Website Pertanian

Website pertanian untuk petani Indonesia: edukasi budidaya + pantau harga pasar sebelum jual
panen. Stack: TypeScript + Next.js App Router + Tailwind + Prisma + PostgreSQL Neon
(`DATABASE_URL`).

MVP 100% publik tanpa login. Fase 2: Auth (OAuth Google via Auth.js v5), Dashboard
Konsultasi (wajib login), Info Obat, Admin UI.

## Struktur Folder

```
app/
  layout.tsx              # minimal: font + metadata saja
  page.tsx                # home MVP
  (public)/layout.tsx     # Navbar + Footer
  (public)/artikel/ + [slug]/       # list + detail (filter kategori + search)
  (public)/harga-pasar/             # HargaExplorer + TrendChart (island)
  (public)/obat/                    # Fase 2 stub: list + filter jenis
  (public)/obat/jenis/[jenis]/      # Fase 2 stub: herbisida|insektisida|fungisida|akarisida
  (public)/obat/[slug]/             # Fase 2 stub: dosis, keamanan, rekomendasi
  (public)/segera-hadir/            # placeholder konsultasi|login|admin + fallback
  (auth)/layout.tsx                 # layout polos tanpa Navbar
  (auth)/login/ + register/         # Fase 2 stub (OAuth Google)
  dashboard/layout.tsx              # Fase 2 stub + nav konsultasi
  dashboard/konsultasi/ + arsip/    # Fase 2 stub (form + riwayat + arsip Q&A)
  admin/layout.tsx                  # Fase 2 stub + nav (guard ADMIN)
  admin/harga|artikel|obat/         # Fase 2 stub CRUD
  api/harga/route.ts                # Fase 2 stub (F-P2-05: ?komoditas&pasar&from&to)
  api/auth/[...nextauth]/           # placeholder OAuth Google (isi di Fase 2)
middleware.ts               # stub guard /dashboard + /admin (isi di Fase 2)
modules/{auth,konsultasi,obat,artikel,harga}/  # Fase 2: schema (zod) + service + types
lib/                        # db, data + mock fallback, format, auth, env, errors
components/ui/              # shared (Button, Input, Badge, EmptyState)
components/features/        # per-fitur: artikel, harga, konsultasi, obat
hooks/ types/               # hooks client + tipe shared generik
prisma/                     # schema (migrasi 001 MVP) + seed
```

- `app/(public)/` — layout Navbar+Footer. Route group `(...)` tidak mengubah URL
  (`/artikel` tetap `/artikel`).
- `modules/<domain>/` — schema (zod) + service + types per domain pertanian
  (artikel/harga/obat/konsultasi/auth). Tanpa `*.repository.ts` — Prisma sudah jadi
  repository. Tanpa `users/products` — tidak ada di PRD.
- `lib/auth.ts` + `app/api/auth/[...nextauth]/` — Auth Fase 2 = OAuth Google (Auth.js v5).
  Folder disiapkan sekarang, implementasi nanti.

## Aturan

1. Server Component default, client hanya island (HargaExplorer, TrendChart, Form).
2. Validasi di `modules/*.schema.ts` + Server Action; guard server-side, jangan cuma hide UI.
3. Tanpa `DATABASE_URL` → mock di `lib/mock.ts`, `npm run build` tetap hijau.
4. Konsultasi TIDAK ada di navbar publik — hanya di dashboard setelah login.

## Commit & Branch

Commit pakai Conventional Commits: `<tipe>: <penjelasan singkat>`.

| Tipe | Pakai untuk |
|---|---|
| `feat` | Fitur/route baru (mis. stub obat, dashboard) |
| `fix` | Perbaikan bug |
| `refactor` | Restruktur/pindah file tanpa ubah perilaku (mis. ke `(public)`) |
| `chore` | Scaffold folder, `.gitkeep`, tooling |
| `docs` | README, PLAN, PRD |
| `style` | Format/visual tanpa logika |
| `test` | Test |

Contoh: `refactor: pindah route publik ke app/(public)`, `feat: stub route obat Fase 2`.

Branch: `<apayangdiubah>/<nama>/<penjelasan-singkat>`.
Contoh: `refactor/jeremi/pindah-public-group`, `feat/sinta/stub-obat`.

Aturan: 1 branch = 1 tujuan, huruf kecil + strip, hapus branch setelah merge.

## Getting Started

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Verifikasi MVP:

- `/`, `/artikel`, `/harga-pasar`, `/segera-hadir?fitur=konsultasi` render 200
- Stub Fase 2: `/obat`, `/login`, `/dashboard/konsultasi`, `/admin/harga`
- `npm run build` hijau tanpa `DATABASE_URL`
