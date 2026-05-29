import type { licensesGet } from "../../types/paths/licenses/{license}.types.js";

export const GET: licensesGet = async ($) => {
  return $.response[200].random();
};
