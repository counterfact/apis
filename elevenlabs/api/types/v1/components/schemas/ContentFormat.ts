/**
 * Canonical representation of a knowledge base document's stored content.
 *
 * HTML is the legacy default; documents created before this field existed are
 * interpreted as HTML.
 * @default "html"
 */
export type ContentFormat = "html" | "markdown";
