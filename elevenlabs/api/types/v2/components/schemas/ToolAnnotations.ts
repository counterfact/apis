/**
 * Additional properties describing a Tool to clients.
 *
 * NOTE: all properties in ToolAnnotations are **hints**.
 * They are not guaranteed to provide a faithful description of
 * tool behavior (including descriptive properties like `title`).
 *
 * Clients should never make tool use decisions based on ToolAnnotations
 * received from untrusted servers.
 */
export type ToolAnnotations = {
  title?: string | null;
  readOnlyHint?: boolean | null;
  destructiveHint?: boolean | null;
  idempotentHint?: boolean | null;
  openWorldHint?: boolean | null;
};
