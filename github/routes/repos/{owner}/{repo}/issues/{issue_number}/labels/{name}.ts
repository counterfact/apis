import type { issuesRemoveLabel } from "../../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/labels/{name}.types.js";

export const DELETE: issuesRemoveLabel = async ($) => {
  return $.response[200].random();
};
