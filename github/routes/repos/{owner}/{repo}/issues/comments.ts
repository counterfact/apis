import type { issuesListCommentsForRepo } from "../../../../../types/paths/repos/{owner}/{repo}/issues/comments.types.js";

export const GET: issuesListCommentsForRepo = async ($) => {
  return $.response[200].random();
};
