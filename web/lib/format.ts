export function formatRupiah(n: number): string {
  return "Rp" + n.toLocaleString("id-ID");
}

export function formatTanggal(iso: string): string {
  const d = new Date(iso.length === 10 ? iso + "T00:00:00" : iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}
