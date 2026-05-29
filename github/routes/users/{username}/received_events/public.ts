import type { activityListReceivedPublicEventsForUser } from "../../../../types/paths/users/{username}/received_events/public.types.js";

export const GET: activityListReceivedPublicEventsForUser = async ($) => {
  return $.response[200].random();
};
