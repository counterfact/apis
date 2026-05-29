import type { pullsListCommentsForReview } from "../../../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments.types.js";

export const GET: pullsListCommentsForReview = async ($) => {
  return $.response[200].random();
};
