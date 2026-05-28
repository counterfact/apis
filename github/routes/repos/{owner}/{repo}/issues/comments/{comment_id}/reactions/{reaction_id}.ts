import type { reactionsDeleteForIssueComment } from "../../../../../../../../types/paths/repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}.types.js";

export const DELETE: reactionsDeleteForIssueComment = async ($) => {
  return $.response[204].empty();
};
