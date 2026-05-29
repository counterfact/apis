import type { metaGetZen } from "../types/paths/zen.types.js";

export const GET: metaGetZen = async ($) => {
  return $.response[200].random();
};
