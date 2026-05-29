import type { issuesPinComment } from "../../../../../../../types/paths/repos/{owner}/{repo}/issues/comments/{comment_id}/pin.types.js";
import type { issuesUnpinComment } from "../../../../../../../types/paths/repos/{owner}/{repo}/issues/comments/{comment_id}/pin.types.js";

export const PUT: issuesPinComment = async ($) => {
  return $.response[200].random();
};

export const DELETE: issuesUnpinComment = async ($) => {
  return $.response[204].empty();
};
