# Dokumentasi Backend — TaniMaju

Backend berjalan di dalam Next.js 16 (App Router): **Route Handler** untuk API publik,
**Server Action** untuk form, **Prisma + PostgreSQL (Neon)** untuk data, dan
**Auth.js v5** (email + password) untuk login.

## Arsitektur

```
Request
  │
  ├─ proxy.ts ─────────── middleware: cek login/role sebelum halaman dirender
  │     └─ lib/route-guard.ts (logika murni, di-unit test)
  │
  ├─ app/api/**/route.ts ─ Route Handler (JSON API)
  ├─ modules/*/*.actions.ts ─ Server Action (form)
  │        │  validasi input: modules/*/*.schema.ts (zod)
  │        ▼
  ├─ modules/*/*.service.ts ─ logika bisnis, lempar AppError
  │        ▼
  └─ lib/db.ts (Prisma)  ── atau ──  lib/mock.ts (tanpa DATABASE_URL)
```

Aturan lapisan:
- **schema** (`*.schema.ts`) — validasi zod + tipe input. Tidak menyentuh DB.
- **service** (`*.service.ts`) — satu-satunya lapisan yang memanggil Prisma. Error dilempar sebagai `AppError`.
- **actions / route** — parse input dengan schema, panggil service, ubah `AppError` jadi respons.
- **guard** (`modules/auth/auth.guard.ts`) — dipakai di layout / Server Action. `proxy.ts` hanya cek optimistis; guard di server tetap wajib.

## Struktur file

| Path | Isi |
|---|---|
| `lib/db.ts` | Prisma client (singleton). `null` bila `DATABASE_URL` kosong → mode mock |
| `lib/data.ts`, `lib/mock.ts` | Baca data publik (artikel, harga) dengan fallback ke mock |
| `lib/errors.ts` | `AppError(message, code)` + `toHttpStatus(code)` |
| `lib/auth.ts` | Konfigurasi Auth.js (Credentials, session JWT, `role` di token) |
| `lib/route-guard.ts` | `decideAuthRedirect`, `getSafeCallbackUrl` |
| `proxy.ts` | Middleware Next.js 16 (pengganti `middleware.ts`) |
| `modules/auth` | register, login, logout, guard |
| `modules/konsultasi` | tanya-jawab petani ↔ pakar |
| `modules/obat` | katalog pestisida (CRUD admin) |
| `modules/artikel` | CRUD artikel admin |
| `modules/harga` | harga komoditas per pasar |
| `prisma/schema.prisma`, `prisma/seed.ts` | Skema DB + data awal |

## Environment

Salin `.env.example` → `.env`.

| Variabel | Wajib | Keterangan |
|---|---|---|
| `DATABASE_URL` | Tidak | Connection string Neon. Kosong = **mode mock** (data contoh, operasi tulis lempar `DB_UNAVAILABLE`) |
| `AUTH_SECRET` | Ya | Buat dengan `npx auth secret` |
| `SEED_ADMIN_PASSWORD` | Tidak | Password admin saat seed (default dev `admin12345`) |

## Database (Prisma)

Model: `User`, `Article`, `Commodity`, `Market`, `Price`, `Consultation`, `Pesticide`.
Enum: `Role` (ADMIN/PAKAR/PETANI), `ArticleCategory`, `Topic`, `KonsultStatus` (OPEN/ANSWERED), `ObatJenis`.

```bash
npx prisma migrate dev     # buat/terapkan migrasi
npx prisma generate        # regenerate client setelah ubah schema
npm run db:seed            # admin, artikel, harga, 8 obat, contoh konsultasi
```

## Error

Semua service melempar `AppError` dengan kode berikut; route/action memetakannya:

| Kode | HTTP | Contoh |
|---|---|---|
| `VALIDATION` | 400 | Query/form tidak lolos zod |
| `UNAUTHORIZED` | 401 | Belum login |
| `FORBIDDEN` | 403 | Role tidak cukup |
| `NOT_FOUND` | 404 | Komoditas/obat/artikel/konsultasi tidak ada |
| `EMAIL_TAKEN`, `SLUG_TAKEN` | 409 | Data unik sudah dipakai |
| `DB_UNAVAILABLE` | 503 | Operasi tulis di mode mock |
| lainnya | 500 | — |

Route Handler mengembalikan `{ "error": "<pesan>", "code": "<KODE>" }`.
Server Action mengembalikan `{ error: "<pesan>" }` atau `{ ok: true }`.

## Autentikasi & otorisasi

- Login: Credentials (email + password, bcrypt cost 10). Session JWT berisi `id` dan `role`.
- Pesan login gagal sengaja disamakan ("Email atau password salah").
- `callbackUrl` hanya boleh path internal (`/...`, bukan `//...`) — cegah open redirect.

Aturan `proxy.ts` (matcher: `/dashboard/*`, `/admin/*`, `/login`, `/register`):

| Kondisi | Hasil |
|---|---|
| Belum login → `/dashboard`, `/admin` | redirect `/login?callbackUrl=...` |
| Sudah login → `/login`, `/register` | redirect `/dashboard` |
| Bukan ADMIN → `/admin` | redirect `/dashboard` |
| Lainnya | lanjut |

Guard server (`modules/auth/auth.guard.ts`):
- `getCurrentUser()` → user atau `null`
- `requireUser()` → redirect `/login` bila belum login
- `requireRole(...roles)` → redirect `/dashboard` bila role tidak cocok

## API

### `GET /api/harga`

Query (semua opsional):

| Param | Format | Keterangan |
|---|---|---|
| `komoditas` | id atau nama | contoh `Cabai Rawit` |
| `pasar` | id atau nama | contoh `Pasar Muntilan` |
| `from`, `to` | `yyyy-mm-dd` | `from` harus ≤ `to` |

Respons `200` (maks 2000 baris, header `Cache-Control: public, max-age=60`):

```json
[{ "date": "2026-09-01", "price": 45000, "commodityId": "c1", "marketId": "m1",
   "commodity": "Cabai Rawit", "market": "Pasar Muntilan", "unit": "kg" }]
```

Error: `400 VALIDATION` (format/rentang tanggal), `404 NOT_FOUND` (komoditas/pasar tidak dikenal).

### `/api/auth/[...nextauth]`
Endpoint bawaan Auth.js — jangan dipanggil manual, gunakan `loginAction`/`logoutAction`.

## Server Action

| Action | Akses | Input (FormData) | Hasil |
|---|---|---|---|
| `loginAction` | publik | `email`, `password`, `callbackUrl?` | redirect / `{error}` |
| `registerAction` | publik | `name`, `email`, `password`, `confirmPassword`, `city?`, `whatsapp?` | daftar lalu login |
| `logoutAction` | login | — | redirect `/` |
| `createConsultationAction` | login | `name`, `topic`, `question` (20–2000 karakter), `city?`, `whatsapp?` | `{ok}` / `{error}` |
| `answerConsultationAction(id)` | PAKAR, ADMIN | `answer` (10–5000 karakter) | status jadi `ANSWERED` |

## Service

| Modul | Fungsi |
|---|---|
| auth | `registerUser`, `authenticate`, `hashPassword`, `verifyPassword` |
| konsultasi | `createConsultation`, `listMyConsultations`, `listAnsweredArchive(limit 1–200)`, `answerConsultation` |
| obat | `listObat({jenis,q,publishedOnly})`, `getObatBySlug`, `createObat`, `updateObat`, `toggleObatPublish`, `deleteObat`, `slugifyObat` |
| artikel | `createArticle`, `updateArticle`, `deleteArticle`, `incrementViews`, `slugify` |
| harga | `getHarga(filter)`, `upsertHarga` (update bila tanggal sudah ada, selain itu create) |

## Unit test

Vitest, file di `__tests__/*.test.ts`.

```bash
npm test             # sekali jalan
npm run test:watch   # mode watch
```

| File | Cakupan |
|---|---|
| `middleware.test.ts` | aturan `proxy.ts` + anti open-redirect |
| `services-db.test.ts` | logika service dengan **Prisma di-mock** (`vi.mock("@/lib/db")`) |
| `guard-actions.test.ts` | guard + Server Action (Auth.js, `redirect`, `revalidatePath` di-mock) |
| `backend.test.ts` | schema + perilaku mode tanpa DB (`DB_UNAVAILABLE`) |
| `harga-route.test.ts` | `GET /api/harga` end-to-end dengan data mock |
| `auth-schema.test.ts`, `data.test.ts`, `errors.test.ts`, `format.test.ts` | schema auth, lapisan data, error, format |

Pola menulis test baru untuk service:

```ts
const { prisma } = vi.hoisted(() => ({ prisma: { user: { findUnique: vi.fn() } } }));
vi.mock("@/lib/db", () => ({ prisma }));
// lalu: prisma.user.findUnique.mockResolvedValue(...)
```

Test tidak butuh database atau `.env`.
