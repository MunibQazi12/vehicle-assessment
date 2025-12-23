import type { ReactElement } from "react";

export function safeJsonLdStringify(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function JsonLd({
  data,
  id,
}: {
  data: unknown;
  id?: string;
}): ReactElement | null {
  if (!data) {
    return null;
  }

  return (
    <script
      {...(id ? { id } : {})}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(data) }}
    />
  );
}

