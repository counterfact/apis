import type { pullsListReviewCommentsForRepo } from "../../../../../types/paths/repos/{owner}/{repo}/pulls/comments.types.js";

export const GET: pullsListReviewCommentsForRepo = async ($) => {
  return $.response[200].random();
};
