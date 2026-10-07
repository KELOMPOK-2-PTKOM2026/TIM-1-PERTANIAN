import Link from "next/link";

import "./Footer.css";

type FootLink = { label: string; href: string };

const JELAJAHI: FootLink[] = [
  { label: "Beranda", href: "/" },
  { label: "Tentang TaniMaju", href: "/tentang" },
];

const LAYANAN: FootLink[] = [
  { label: "Harga Pasar", href: "/harga-pasar" },
  { label: "Artikel Pertanian", href: "/artikel" },
  { label: "Info Obat", href: "/obat" },
];

const AKUN: FootLink[] = [
  { label: "Masuk", href: "/login" },
  { label: "Daftar", href: "/register" },
];

function Kolom({ title, links }: { title: string; links: FootLink[] }) {
  return (
    <div>
      <h4 className="text-sm font-bold uppercase tracking-wide text-white">
        {title}
      </h4>

      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-emerald-100/80 transition hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      {/* Background image */}
      <div className="footer-background" />

      {/* Isi footer */}
      <div className="relative z-[2] mx-auto w-full max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img
              src="/tanimajulogo.png"
              alt="Logo Tanimaju"
              className="block h-auto w-40"
            />

            <p className="mt-4 text-sm leading-relaxed text-emerald-100/80">
              Setapak demi setapak, selangkah demi selangkah — timba
              pengalaman, perkaya wawasan, dan pantau harga pasar sebelum
              menjual panen.
            </p>
          </div>

          <Kolom title="Jelajahi" links={JELAJAHI} />
          <Kolom title="Layanan & Fitur" links={LAYANAN} />

          <Kolom title="Akun" links={AKUN} />
        </div>

        <div className="mt-10 border-t border-white/15 pt-5 text-center">
          <p className="text-sm text-emerald-50">
            © 2025 Tanimaju. Hak Cipta Dilindungi.
          </p>

          <p className="mt-1 text-xs text-emerald-100/70">
            Inovasi Digital Agrikultur untuk Petani Indonesia Sejahtera
          </p>
        </div>
      </div>
    </footer>
  );
}
