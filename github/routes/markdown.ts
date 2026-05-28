import type { markdownRender } from "../types/paths/markdown.types.js";

export const POST: markdownRender = async ($) => {
  return $.response[200].random();
};
