import type { reposCompareCommits } from "../../../../../types/paths/repos/{owner}/{repo}/compare/{basehead}.types.js";

export const GET: reposCompareCommits = async ($) => {
  return $.response[200].random();
};
