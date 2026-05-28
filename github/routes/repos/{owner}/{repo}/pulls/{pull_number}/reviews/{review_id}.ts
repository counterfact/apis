import type { pullsGetReview } from "../../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}.types.js";
import type { pullsUpdateReview } from "../../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}.types.js";
import type { pullsDeletePendingReview } from "../../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}.types.js";

export const GET: pullsGetReview = async ($) => {
  return $.response[200].random();
};

export const PUT: pullsUpdateReview = async ($) => {
  return $.response[200].random();
};

export const DELETE: pullsDeletePendingReview = async ($) => {
  return $.response[200].random();
};
