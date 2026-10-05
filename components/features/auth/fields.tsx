// Elemen form auth bersama (login + register).
export const inputClass =
  "w-full rounded-md bg-stone-100 py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-stone-400 focus:ring-2 focus:ring-tani-400";

export const ICON = {
  lock: "M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  mail: "M3 6h18v12H3zM3 6l9 7 9-7",
  phone: "M8 2h8v20H8zM11 18h2",
};

export function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden>
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
