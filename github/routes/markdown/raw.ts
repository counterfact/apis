import type { markdownRenderRaw } from "../../types/paths/markdown/raw.types.js";

export const POST: markdownRenderRaw = async ($) => {
  const text = ($ as unknown as { body: string }).body ?? "";
  const html = $.context.renderRaw(text);
  const version = $.context.commonMarkerVersion();
  return $.response[200].header("X-CommonMarker-Version", version).html(html);
};
