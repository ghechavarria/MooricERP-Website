export type LegalBlock =
  | { kind: "h2" | "h3" | "p" | "strong"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "table"; head: string[]; rows: string[][] };

/** A legal document as generated from its Word file (see docs/legal-pages.md). */
export type LegalDoc = {
  company: string;
  title: string;
  /** Lines under the title: subtitle, effective date, last updated. */
  meta: string[];
  blocks: LegalBlock[];
};
