import type { activityListPublicEventsForUser } from "../../../../types/paths/users/{username}/events/public.types.js";

export const GET: activityListPublicEventsForUser = async ($) => {
  return $.response[200].random();
};
