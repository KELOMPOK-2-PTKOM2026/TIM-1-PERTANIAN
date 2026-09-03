import { Fragment } from "react";

// Perender markdown super-ringkas untuk konten artikel MVP:
// mendukung heading ##, list bernomor/tidak, dan **tebal**.
export default function Markdown({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/);
  return (
    <div className="space-y-4 text-[15px] leading-relaxed">
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim());
        if (lines[0].startsWith("## ")) {
          return (
            <h2 key={i} className="pt-2 text-xl font-bold text-tani-900">
              {renderInline(lines[0].slice(3))}
            </h2>
          );
        }
        if (lines.every((l) => /^(\d+\.|[-*])\s/.test(l))) {
          const ordered = /^\d+\./.test(lines[0]);
          const items = lines.map((l) => l.replace(/^(\d+\.|[-*])\s/, ""));
          const List = ordered ? "ol" : "ul";
          return (
            <List
              key={i}
              className={ordered ? "list-decimal space-y-1 pl-6" : "list-disc space-y-1 pl-6"}
            >
              {items.map((it, j) => (
                <li key={j}>{renderInline(it)}</li>
              ))}
            </List>
          );
        }
        return (
          <p key={i} className="text-stone-700">
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {renderInline(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text: string) {
  const parts = text.split("**");
  return parts.map((p, i) =>
    i % 2 === 1 ? <strong key={i}>{p}</strong> : <Fragment key={i}>{p}</Fragment>,
  );
}
