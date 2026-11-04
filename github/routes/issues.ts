import type { issuesList } from "../types/paths/issues.types.js";

export const GET: issuesList = async ($) => {
  return $.response[200].json($.context.listAllIssues($.query));
};
