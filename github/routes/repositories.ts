import type { reposListPublic } from "../types/paths/repositories.types.js";

export const GET: reposListPublic = async ($) => {
  return $.response[200].random();
};
