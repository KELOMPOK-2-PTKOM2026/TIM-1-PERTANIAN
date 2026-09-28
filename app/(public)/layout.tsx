import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Layout publik: Navbar + Footer untuk home, artikel, harga-pasar, obat, segera-hadir.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4">{children}</main>
      <Footer />
    </>
  );
}
