import type { activityListEventsForAuthenticatedUser } from "../../../types/paths/users/{username}/events.types.js";

export const GET: activityListEventsForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};
