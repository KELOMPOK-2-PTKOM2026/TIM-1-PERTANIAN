import Link from "next/link";

import "./Footer.css";

type FootLink = { label: string; href: string };

const TENTANG: FootLink[] = [
  { label: "Profil Perusahaan", href: "/segera-hadir?fitur=tentang" },
  { label: "Visi & Misi", href: "/segera-hadir?fitur=tentang" },
  { label: "Karir", href: "/segera-hadir?fitur=karir" },
  { label: "Tim Ahli Tani", href: "/segera-hadir?fitur=tim" },
  { label: "Berita & Siaran Pers", href: "/artikel" },
];

const LAYANAN: FootLink[] = [
  { label: "Informasi Pasar & Harga", href: "/harga-pasar" },
  { label: "Edukasi Pertanian Modern", href: "/artikel" },
  { label: "Komoditas Nusantara", href: "/harga-pasar" },
  { label: "Analisis Prediksi Cuaca", href: "/segera-hadir?fitur=cuaca" },
  { label: "Program Kemitraan Tani", href: "/segera-hadir?fitur=kemitraan" },
];

const BANTUAN_A: FootLink[] = [
  { label: "Hubungi Kami", href: "/segera-hadir?fitur=kontak" },
  { label: "Pusat Bantuan & FAQ", href: "/segera-hadir?fitur=faq" },
  { label: "Syarat & Ketentuan", href: "/segera-hadir?fitur=syarat" },
];

const BANTUAN_B: FootLink[] = [
  { label: "WhatsApp Support", href: "/segera-hadir?fitur=whatsapp" },
  { label: "Kebijakan Privasi", href: "/segera-hadir?fitur=privasi" },
];

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L1.2 2h6.4l4.4 5.9L18.9 2zm-1.1 18h1.7L7.1 3.9H5.3L17.8 20z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4V14h2.7v8h3.4z" />
    </svg>
  );
}

const SOSMED = [
  { label: "Website", href: "/", Icon: GlobeIcon },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { label: "YouTube", href: "https://youtube.com", Icon: YoutubeIcon },
  { label: "X", href: "https://x.com", Icon: XIcon },
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
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

          <Kolom title="Tentang Kami" links={TENTANG} />
          <Kolom title="Layanan & Fitur" links={LAYANAN} />

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-white">
              Bantuan &amp; Kontak
            </h4>

            <div className="mt-4 grid grid-cols-2 gap-6">
              <ul className="space-y-2.5">
                {BANTUAN_A.map((l) => (
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

              <ul className="space-y-2.5">
                {BANTUAN_B.map((l) => (
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
          </div>
        </div>

        <div className="mt-10">
          <p className="text-sm font-bold uppercase tracking-wide text-white">
            Ikuti Kami
          </p>

          <div className="mt-3 flex gap-2.5">
            {SOSMED.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-emerald-50 transition hover:bg-white/10"
              >
                <Icon />
              </a>
            ))}
          </div>
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
