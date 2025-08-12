import { cn } from "@/lib/utils";
import type { LegalDoc, LegalBlock } from "./legal-types";

function renderBlock(block: LegalBlock, idx: number) {
  if (block.type === "p") {
    return (
      <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {block.text}
      </p>
    );
  }
  if (block.type === "ul" || block.type === "ol") {
    const ListTag = block.type === "ul" ? "ul" : "ol";
    return (
      <ListTag
        key={idx}
        className={cn(
          "list-inside space-y-2 ml-4",
          block.type === "ul" ? "list-disc" : "list-decimal",
          "text-gray-700 dark:text-gray-300"
        )}
      >
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ListTag>
    );
  }
  if (block.type === "custom") {
    return <div key={idx}>{block.render()}</div>;
  }
  return null;
}

export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{doc.title}</h1>
        最後更新日期：{doc.updatedAt}
      </div>

      {doc.intro && doc.intro.length > 0 && (
        <div className="mb-8 space-y-4">
          {doc.intro.map((b, i) => renderBlock(b, i))}
        </div>
      )}

      {/* 目錄已移除 */}

      <div className="space-y-8">
        {doc.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h2>
            <div className="space-y-4">{section.blocks.map((b, i) => renderBlock(b, i))}</div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default LegalDocument;


