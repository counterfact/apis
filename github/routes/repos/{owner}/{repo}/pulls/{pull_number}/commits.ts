import type { pullsListCommits } from "../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/commits.types.js";

export const GET: pullsListCommits = async ($) => {
  return $.response[200].random();
};
