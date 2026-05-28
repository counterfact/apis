import type { issuesGetEvent } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/events/{event_id}.types.js";

export const GET: issuesGetEvent = async ($) => {
  return $.response[200].random();
};
