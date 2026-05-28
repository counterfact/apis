import type { searchRepos } from "../../types/paths/search/repositories.types.js";

export const GET: searchRepos = async ($) => {
  return $.response[200].random();
};
