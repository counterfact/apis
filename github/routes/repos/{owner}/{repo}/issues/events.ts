import type { issuesListEventsForRepo } from "../../../../../types/paths/repos/{owner}/{repo}/issues/events.types.js";

export const GET: issuesListEventsForRepo = async ($) => {
  return $.response[200].random();
};
