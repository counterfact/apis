import type { gistsList } from "../types/paths/gists.types.js";
import type { gistsCreate } from "../types/paths/gists.types.js";

export const GET: gistsList = async ($) => {
  return $.response[200].random();
};

export const POST: gistsCreate = async ($) => {
  return $.response[201].random();
};
