import type { pullsListReviews } from "../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/reviews.types.js";
import type { pullsCreateReview } from "../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/reviews.types.js";

export const GET: pullsListReviews = async ($) => {
  return $.response[200].random();
};

export const POST: pullsCreateReview = async ($) => {
  return $.response[200].random();
};
