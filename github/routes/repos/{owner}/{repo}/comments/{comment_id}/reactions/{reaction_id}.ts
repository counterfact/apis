import type { reactionsDeleteForCommitComment } from "../../../../../../../types/paths/repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}.types.js";

export const DELETE: reactionsDeleteForCommitComment = async ($) => {
  return $.response[204].empty();
};
