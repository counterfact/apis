import type { markdownRenderRaw } from "../../types/paths/markdown/raw.types.js";

export const POST: markdownRenderRaw = async ($) => {
  return $.response[200].random();
};
