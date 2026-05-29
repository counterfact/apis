import type { reactionsListForIssueComment } from "../../../../../../../types/paths/repos/{owner}/{repo}/issues/comments/{comment_id}/reactions.types.js";
import type { reactionsCreateForIssueComment } from "../../../../../../../types/paths/repos/{owner}/{repo}/issues/comments/{comment_id}/reactions.types.js";

export const GET: reactionsListForIssueComment = async ($) => {
  return $.response[200].random();
};

export const POST: reactionsCreateForIssueComment = async ($) => {
  return $.response[200].random();
};
