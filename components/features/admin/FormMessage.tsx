import type { AdminFormState } from "@/modules/admin/admin.shared";

export default function FormMessage({ state }: { state: AdminFormState }) {
  if (state?.error)
    return (
      <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
        {state.error}
      </p>
    );
  if (state?.ok) return <p className="rounded-lg bg-tani-50 px-3 py-2 text-sm text-tani-700">{state.ok}</p>;
  return null;
}
