import type { markdownRenderRaw } from "../../types/paths/markdown/raw.types.js";

export const POST: markdownRenderRaw = async ($) => {
  const body = ($ as unknown as { body?: string | { text?: string } }).body;
  const text = typeof body === "string" ? body : (body?.text ?? "");
  const html = $.context.renderRaw(text);
  const version = $.context.commonMarkerVersion();
  return $.response[200].header("X-CommonMarker-Version", version).html(html);
};
