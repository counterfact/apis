import type { searchLabels } from "../../types/paths/search/labels.types.js";

export const GET: searchLabels = async ($) => {
  return $.response[200].random();
};
