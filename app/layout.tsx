import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Plus Jakarta Sans = font desain, dipasang di body (globals.css) jadi
// berlaku untuk semua route. Font ini menggantikan Poppins yang sebelumnya
// dipakai landing page.
const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaniMaju — Info & Edukasi Pertanian",
  description:
    "Website pertanian untuk petani Indonesia: informasi harga pasar, tips budidaya, dan solusi masalah tanaman.",
};

// Root layout minimal: font + metadata saja.
// Navbar/Footer pindah ke app/(public)/layout.tsx agar
// (auth)/dashboard/admin bisa pakai layout sendiri.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${jakartaSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
