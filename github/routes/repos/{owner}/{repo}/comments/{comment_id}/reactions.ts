import type { reactionsListForCommitComment } from "../../../../../../types/paths/repos/{owner}/{repo}/comments/{comment_id}/reactions.types.js";
import type { reactionsCreateForCommitComment } from "../../../../../../types/paths/repos/{owner}/{repo}/comments/{comment_id}/reactions.types.js";

export const GET: reactionsListForCommitComment = async ($) => {
  return $.response[200].random();
};

export const POST: reactionsCreateForCommitComment = async ($) => {
  return $.response[200].random();
};
