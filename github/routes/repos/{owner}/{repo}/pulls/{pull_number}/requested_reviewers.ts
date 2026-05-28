import type { pullsListRequestedReviewers } from "../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers.types.js";
import type { pullsRequestReviewers } from "../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers.types.js";
import type { pullsRemoveRequestedReviewers } from "../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers.types.js";

export const GET: pullsListRequestedReviewers = async ($) => {
  return $.response[200].random();
};

export const POST: pullsRequestReviewers = async ($) => {
  return $.response[201].random();
};

export const DELETE: pullsRemoveRequestedReviewers = async ($) => {
  return $.response[200].random();
};
