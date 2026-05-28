import type { licensesGetAllCommonlyUsed } from "../types/paths/licenses.types.js";

export const GET: licensesGetAllCommonlyUsed = async ($) => {
  return $.response[200].random();
};
