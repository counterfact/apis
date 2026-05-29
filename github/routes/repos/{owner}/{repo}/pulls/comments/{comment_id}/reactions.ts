import type { reactionsListForPullRequestReviewComment } from "../../../../../../../types/paths/repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions.types.js";
import type { reactionsCreateForPullRequestReviewComment } from "../../../../../../../types/paths/repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions.types.js";

export const GET: reactionsListForPullRequestReviewComment = async ($) => {
  return $.response[200].random();
};

export const POST: reactionsCreateForPullRequestReviewComment = async ($) => {
  return $.response[200].random();
};
