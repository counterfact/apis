import type { searchCommits } from "../../types/paths/search/commits.types.js";

export const GET: searchCommits = async ($) => {
  return $.response[200].random();
};
