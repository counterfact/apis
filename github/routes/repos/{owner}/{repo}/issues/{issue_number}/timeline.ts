import type { issuesListEventsForTimeline } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/timeline.types.js";

export const GET: issuesListEventsForTimeline = async ($) => {
  return $.response[200].random();
};
