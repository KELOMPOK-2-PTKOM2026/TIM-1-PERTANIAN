// Validasi env. AUTH_SECRET wajib untuk session Auth.js; DATABASE_URL opsional (mode mock).
export function assertAuthEnv() {
  if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET belum diisi. Jalankan `npx auth secret` lalu isi .env");
  }
}
