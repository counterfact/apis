import type { gistsListStarred } from "../../types/paths/gists/starred.types.js";

export const GET: gistsListStarred = async ($) => {
  return $.response[200].random();
};
