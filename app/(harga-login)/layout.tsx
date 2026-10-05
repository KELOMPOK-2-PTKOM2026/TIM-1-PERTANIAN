import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Layout khusus /harga-pasar-login: sama seperti (public) tapi Navbar
// memakai variant "harga" sesuai desain (menu + Tentang, tombol Sign In
// polos di kanan, logo lime). Dipisah supaya halaman publik lain
// (/, /artikel, /harga-pasar, /obat) tidak ikut berubah.
// TODO Fase 2: setelah Auth.js v5 siap, ganti stub "Sign In" di navbar
// dengan menu akun (nama + logout) untuk sesi yang sudah login.
export default function HargaLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Wrapper flex supaya Navbar + main + Footer ikut rata atas-bawah seperti
  // (public)/layout.tsx. Font sudah global di body (globals.css).
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar variant="harga" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4">{children}</main>
      <Footer />
    </div>
  );
}
