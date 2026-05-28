import type { metaRoot } from "../types/paths/index.types.js";

export const GET: metaRoot = async ($) => {
  return $.response[200].random();
};
