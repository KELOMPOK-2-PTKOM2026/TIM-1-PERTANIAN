"use client";

import { useActionState, useState } from "react";
import { registerAction } from "@/modules/auth/auth.actions";
import { ICON, Icon, inputClass } from "./fields";

function Field({
  id,
  label,
  hint,
  icon,
  children,
}: {
  id: string;
  label: string;
  hint?: React.ReactNode;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-stone-900">
          {label}
        </label>
        {hint}
      </div>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
          <Icon d={icon} />
        </span>
        {children}
      </div>
    </div>
  );
}

export default function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const rounded = `${inputClass} rounded-full`;

  return (
    <form action={action} className="space-y-5">
      <Field id="name" label="Nama Lengkap" icon={ICON.user}>
        <input id="name" name="name" required minLength={2} placeholder="Bambang Sutrisno" className={rounded} />
      </Field>

      <Field id="email" label="Email" icon={ICON.mail}>
        <input id="email" name="email" type="email" required placeholder="nama@petani.id" className={rounded} />
      </Field>

      <Field
        id="whatsapp"
        label="Nomor WhatsApp"
        icon={ICON.phone}
        // Tampilan saja: verifikasi OTP belum ada.
        hint={<span className="text-xs font-medium text-tani-600">Verifikasi SMS / OTP</span>}
      >
        <input id="whatsapp" name="whatsapp" type="tel" placeholder="0812-3456-7890" className={rounded} />
      </Field>

      <Field
        id="password"
        label="Kata Sandi"
        icon={ICON.lock}
        hint={<span className="text-xs text-stone-500">Min. 8 karakter</span>}
      >
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          required
          minLength={8}
          placeholder="Minimal 8 karakter"
          className={`${rounded} pr-10`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800"
        >
          <Icon d={ICON.eye} />
        </button>
      </Field>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[#b5f23d] py-3 text-sm font-semibold text-stone-900 shadow-sm transition hover:brightness-95 disabled:opacity-60"
      >
        {pending ? "Memproses..." : "Daftar Sekarang →"}
      </button>
    </form>
  );
}
