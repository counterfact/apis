import type { activityListReceivedEventsForUser } from "../../../types/paths/users/{username}/received_events.types.js";

export const GET: activityListReceivedEventsForUser = async ($) => {
  return $.response[200].random();
};
