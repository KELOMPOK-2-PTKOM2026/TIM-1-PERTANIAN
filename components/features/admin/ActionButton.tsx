"use client";

import { useFormStatus } from "react-dom";

// Tombol submit untuk form aksi cepat (hapus/publish); opsional konfirmasi.
function Inner({ children, className, confirmText }: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (confirmText && !window.confirm(confirmText)) e.preventDefault();
      }}
    >
      {pending ? "…" : children}
    </button>
  );
}

type Props = { children: React.ReactNode; className?: string; confirmText?: string };

export default function ActionButton({
  action,
  fields,
  ...props
}: Props & { action: (formData: FormData) => Promise<void>; fields: Record<string, string> }) {
  return (
    <form action={action}>
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <Inner {...props} />
    </form>
  );
}
