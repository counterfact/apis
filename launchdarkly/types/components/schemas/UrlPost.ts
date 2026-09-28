export type UrlPost = {
  kind?: "exact" | "canonical" | "substring" | "regex";
  url?: string;
  substring?: string;
  pattern?: string;
};
