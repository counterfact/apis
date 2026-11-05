/**
 * An optionally-sized icon for display in a user interface (2025-11-25+).
 */
export type Icon = {
  src: string;
  mimeType?: string | null;
  sizes?: Array<string> | null;
  theme?: ("light" | "dark") | null;
};
