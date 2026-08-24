import type { issuesListForAuthenticatedUser } from "../../types/paths/user/issues.types.js";

export const GET: issuesListForAuthenticatedUser = async ($) => {
  return $.response[200].json($.context.listAllIssues($.query));
};
