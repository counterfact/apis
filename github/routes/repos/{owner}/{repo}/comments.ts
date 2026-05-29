import type { reposListCommitCommentsForRepo } from "../../../../types/paths/repos/{owner}/{repo}/comments.types.js";

export const GET: reposListCommitCommentsForRepo = async ($) => {
  return $.response[200].random();
};
