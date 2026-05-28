import type { pullsSubmitReview } from "../../../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events.types.js";

export const POST: pullsSubmitReview = async ($) => {
  return $.response[200].random();
};
