import type { pullsGetReviewComment } from "../../../../../../types/paths/repos/{owner}/{repo}/pulls/comments/{comment_id}.types.js";
import type { pullsUpdateReviewComment } from "../../../../../../types/paths/repos/{owner}/{repo}/pulls/comments/{comment_id}.types.js";
import type { pullsDeleteReviewComment } from "../../../../../../types/paths/repos/{owner}/{repo}/pulls/comments/{comment_id}.types.js";

export const GET: pullsGetReviewComment = async ($) => {
  return $.response[200].random();
};

export const PATCH: pullsUpdateReviewComment = async ($) => {
  return $.response[200].random();
};

export const DELETE: pullsDeleteReviewComment = async ($) => {
  return $.response[204].empty();
};
