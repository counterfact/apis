import type { pullsListReviewComments } from "../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/comments.types.js";
import type { pullsCreateReviewComment } from "../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/comments.types.js";

export const GET: pullsListReviewComments = async ($) => {
  return $.response[200].random();
};

export const POST: pullsCreateReviewComment = async ($) => {
  return $.response[201].random();
};
