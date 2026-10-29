"use client";

import { useActionState } from "react";
import { answerAction } from "@/modules/konsultasi/konsultasi.actions";
import FormMessage from "@/components/features/admin/FormMessage";
import { Spinner } from "@/components/ui/button";
import { fieldClass } from "./styles";

export default function AnswerForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(answerAction, undefined);

  return (
    <form action={action} className="space-y-3 border-t border-stone-100 pt-3">
      <input type="hidden" name="id" value={id} />
      <label htmlFor={`answer-${id}`} className="sr-only">Jawaban</label>
      <textarea
        id={`answer-${id}`}
        name="answer"
        required
        minLength={10}
        rows={4}
        placeholder="Tulis jawaban…"
        className={fieldClass}
      />
      <FormMessage state={state} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand-400 px-5 py-2 text-sm font-semibold text-brand-950 hover:bg-brand-300 disabled:opacity-60"
      >
        {pending ? (
          <span className="inline-flex items-center gap-2">
            <Spinner /> Mengirim…
          </span>
        ) : (
          "Kirim Jawaban"
        )}
      </button>
    </form>
  );
}
