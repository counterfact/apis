import type { activityListOrgEventsForAuthenticatedUser } from "../../../../../types/paths/users/{username}/events/orgs/{org}.types.js";

export const GET: activityListOrgEventsForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};
