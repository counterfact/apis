import type { markdownRender } from "../types/paths/markdown.types.js";

export const POST: markdownRender = async ($) => {
  const html = $.context.renderMarkdown(
    $.body.text,
    $.body.mode,
    $.body.context,
  );
  const version = $.context.markdownCommonMarkerVersion();
  return $.response[200]
    .header("Content-Type", "text/html; charset=utf-8")
    .header("Content-Length", String(Buffer.byteLength(html, "utf8")))
    .header("X-CommonMarker-Version", version)
    .html(html);
};
