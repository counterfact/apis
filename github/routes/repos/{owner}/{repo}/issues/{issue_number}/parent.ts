import type { issuesGetParent } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/parent.types.js";

export const GET: issuesGetParent = async ($) => {
  return $.response[200].random();
};
