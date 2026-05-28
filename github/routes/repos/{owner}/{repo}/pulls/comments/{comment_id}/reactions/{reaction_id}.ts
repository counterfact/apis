import type { reactionsDeleteForPullRequestComment } from "../../../../../../../../types/paths/repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}.types.js";

export const DELETE: reactionsDeleteForPullRequestComment = async ($) => {
  return $.response[204].empty();
};
