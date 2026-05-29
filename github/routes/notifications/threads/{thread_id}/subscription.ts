import type { activityGetThreadSubscriptionForAuthenticatedUser } from "../../../../types/paths/notifications/threads/{thread_id}/subscription.types.js";
import type { activitySetThreadSubscription } from "../../../../types/paths/notifications/threads/{thread_id}/subscription.types.js";
import type { activityDeleteThreadSubscription } from "../../../../types/paths/notifications/threads/{thread_id}/subscription.types.js";

export const GET: activityGetThreadSubscriptionForAuthenticatedUser = async (
  $,
) => {
  return $.response[200].random();
};

export const PUT: activitySetThreadSubscription = async ($) => {
  return $.response[200].random();
};

export const DELETE: activityDeleteThreadSubscription = async ($) => {
  return $.response[204].empty();
};
