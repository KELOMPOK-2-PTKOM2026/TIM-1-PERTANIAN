"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/modules/admin/admin.actions";
import FormMessage from "./FormMessage";
import { btnPrimary, card, Field, input } from "./ui";

export default function ProfileForm({
  profile,
}: {
  profile: { name: string; email: string; city: string | null; whatsapp: string | null };
}) {
  const [state, action, pending] = useActionState(updateProfileAction, undefined);
  return (
    <form action={action} className={`${card} max-w-xl space-y-4 p-6`}>
      <Field label="Email">
        <input value={profile.email} disabled className={`${input} bg-stone-50 text-stone-500`} />
      </Field>
      <Field label="Nama">
        <input name="name" required defaultValue={profile.name} className={input} />
      </Field>
      <Field label="Kota">
        <input name="city" defaultValue={profile.city ?? ""} className={input} />
      </Field>
      <Field label="WhatsApp">
        <input name="whatsapp" defaultValue={profile.whatsapp ?? ""} className={input} />
      </Field>
      <FormMessage state={state} />
      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Menyimpan…" : "Simpan profil"}
      </button>
    </form>
  );
}
