import type { reactionsDeleteForIssue } from "../../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}.types.js";

export const DELETE: reactionsDeleteForIssue = async ($) => {
  return $.response[204].empty();
};
