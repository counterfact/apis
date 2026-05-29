import type { pullsCreateReplyForReviewComment } from "../../../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies.types.js";

export const POST: pullsCreateReplyForReviewComment = async ($) => {
  return $.response[201].random();
};
