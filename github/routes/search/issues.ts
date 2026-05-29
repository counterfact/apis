import type { searchIssuesAndPullRequests } from "../../types/paths/search/issues.types.js";

export const GET: searchIssuesAndPullRequests = async ($) => {
  return $.response[200].json($.context.searchIssuesAndPullRequests($.query));
};
