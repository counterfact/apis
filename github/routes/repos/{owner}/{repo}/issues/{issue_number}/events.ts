import type { issuesListEvents } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/events.types.js";

export const GET: issuesListEvents = async ($) => {
  return $.response[200].random();
};
