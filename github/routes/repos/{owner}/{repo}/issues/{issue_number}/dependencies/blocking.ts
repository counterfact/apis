import type { issuesListDependenciesBlocking } from "../../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocking.types.js";

export const GET: issuesListDependenciesBlocking = async ($) => {
  return $.response[200].random();
};
