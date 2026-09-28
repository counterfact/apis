import type { getRoot } from "../../types/paths/api/v2.types.js";

export const GET: getRoot = async ($) => {
  return $.response[200].random();
};
