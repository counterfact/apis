import type { MarkdownRenderRaw } from "./raw.contract.js";

export const POST: MarkdownRenderRaw = async ($) => {
  const html = $.context.renderRaw($.body);
  const version = $.context.commonMarkerVersion();
  return $.response[200].header("X-CommonMarker-Version", version).html(html);
};
