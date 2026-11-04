import type { markdownRenderRaw } from "../../types/paths/markdown/raw.types.js";

type MarkdownRawArgument = Parameters<markdownRenderRaw>[0] & { body: string };

/**
 * Counterfact 2.12 omits text-only request bodies from generated route types.
 * Keep the local transport correction outside generated output so regeneration
 * cannot erase the route's plain-text body contract.
 */
export type MarkdownRenderRaw = (
  $: MarkdownRawArgument,
) => ReturnType<markdownRenderRaw>;
