import type { activityListPublicOrgEvents } from "../../../types/paths/orgs/{org}/events.types.js";

export const GET: activityListPublicOrgEvents = async ($) => {
  return $.response[200].random();
};
