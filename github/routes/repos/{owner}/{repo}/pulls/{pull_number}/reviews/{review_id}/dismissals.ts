import type { pullsDismissReview } from "../../../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals.types.js";

export const PUT: pullsDismissReview = async ($) => {
  return $.response[200].random();
};
