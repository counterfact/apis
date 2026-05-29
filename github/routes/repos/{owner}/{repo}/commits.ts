import type { reposListCommits } from "../../../../types/paths/repos/{owner}/{repo}/commits.types.js";

export const GET: reposListCommits = async ($) => {
  return $.response[200].random();
};
