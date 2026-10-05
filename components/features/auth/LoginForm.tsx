"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { loginAction } from "@/modules/auth/auth.actions";
import { ICON, Icon, inputClass } from "./fields";

export default function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, action, pending] = useActionState(loginAction, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/dashboard"} />

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-stone-900">
          Email
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
            @
          </span>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="nama@petani.id"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-semibold text-stone-900">
            Kata Sandi
          </label>
          <Link
            href="/segera-hadir?fitur=login"
            className="text-xs font-medium text-tani-600 hover:underline"
          >
            Lupa Kata Sandi?
          </Link>
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
            <Icon d={ICON.lock} />
          </span>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            placeholder="Masukkan kata sandi akun"
            className={`${inputClass} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800"
          >
            <Icon d={ICON.eye} />
          </button>
        </div>
      </div>

      {/* Tampilan saja: belum memengaruhi durasi session. */}
      <label className="flex items-center gap-2 text-xs text-stone-600">
        <input type="checkbox" className="h-4 w-4 rounded border-stone-300 accent-tani-600" />
        Ingat sesi saya di perangkat ini
      </label>

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
        {pending ? "Memproses..." : "Masuk ke Akun →"}
      </button>
    </form>
  );
}
