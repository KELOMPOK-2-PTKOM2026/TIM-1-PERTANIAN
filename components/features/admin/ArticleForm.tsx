"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import Markdown from "@/components/Markdown";
import { CATEGORY_LABEL } from "@/lib/mock";
import { saveArticleAction } from "@/modules/artikel/artikel.actions";
import type { AdminArticle } from "@/modules/artikel/artikel.service";
import FormMessage from "./FormMessage";
import { btnGhost, btnPrimary, card, Field, input } from "./ui";

export default function ArticleForm({ article, readOnly }: { article?: AdminArticle; readOnly?: boolean }) {
  const [state, action, pending] = useActionState(saveArticleAction, undefined);
  const [content, setContent] = useState(article?.contentMd ?? "");
  const [preview, setPreview] = useState(false);

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_300px]">
      {article && <input type="hidden" name="id" value={article.id} />}
      <div className={`${card} space-y-4 p-6`}>
        <Field label="Judul">
          <input name="title" required defaultValue={article?.title} className={input} />
        </Field>
        <Field label="Ringkasan" hint="Tampil di kartu artikel (maks. 300 karakter).">
          <textarea name="excerpt" required rows={2} maxLength={300} defaultValue={article?.excerpt} className={input} />
        </Field>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-700">Isi (Markdown)</span>
            <button type="button" onClick={() => setPreview((v) => !v)} className={btnGhost}>
              {preview ? "Edit" : "Pratinjau"}
            </button>
          </div>
          <textarea
            name="contentMd"
            required
            rows={18}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`${input} font-mono ${preview ? "hidden" : ""}`}
            placeholder={"## Subjudul\n\nParagraf...\n\n1. Langkah satu\n2. **Tebal**"}
          />
          {preview && (
            <div className="min-h-[300px] rounded-lg border border-stone-200 p-4">
              <Markdown text={content || "_Belum ada isi_"} />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className={`${card} space-y-4 p-5`}>
          <Field label="Status">
            <select name="status" defaultValue={article?.publishedAt ? "publish" : "draft"} className={input}>
              <option value="draft">Draft</option>
              <option value="publish">Terbit</option>
            </select>
          </Field>
          <Field label="Kategori">
            <select name="category" defaultValue={article?.category ?? "PENGETAHUAN"} className={input}>
              {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tag" hint="Pisahkan dengan koma.">
            <input name="tags" defaultValue={article?.tags.join(", ")} className={input} />
          </Field>
          <Field label="Penulis" hint="Kosong = Tim Tanimaju.">
            <input name="author" defaultValue={article?.author ?? ""} className={input} />
          </Field>
          <Field label="Slug" hint="Kosongkan untuk dibuat otomatis dari judul.">
            <input name="slug" defaultValue={article?.slug} className={input} />
          </Field>
          <Field label="URL gambar cover">
            <input name="coverUrl" type="url" defaultValue={article?.coverUrl ?? ""} className={input} />
          </Field>
        </div>
        <FormMessage state={state} />
        <div className="flex gap-2">
          <button type="submit" disabled={pending || readOnly} className={`${btnPrimary} flex-1`}>
            {pending ? "Menyimpan…" : "Simpan"}
          </button>
          <Link href="/admin/artikel" className={btnGhost}>
            Batal
          </Link>
        </div>
      </div>
    </form>
  );
}
