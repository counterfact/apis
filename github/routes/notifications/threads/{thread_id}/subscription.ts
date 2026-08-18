import type { activityGetThreadSubscriptionForAuthenticatedUser } from "../../../../types/paths/notifications/threads/{thread_id}/subscription.types.js";
import type { activitySetThreadSubscription } from "../../../../types/paths/notifications/threads/{thread_id}/subscription.types.js";
import type { activityDeleteThreadSubscription } from "../../../../types/paths/notifications/threads/{thread_id}/subscription.types.js";

export const GET: activityGetThreadSubscriptionForAuthenticatedUser = async (
  $,
) => {
  const threadId = String($.path.thread_id);
  if (!$.context.getNotification(threadId)) return $.response[404].empty();
  const subscription = $.context.getThreadSubscription(threadId);
  return subscription
    ? $.response[200].json(subscription)
    : $.response[404].empty();
};

export const PUT: activitySetThreadSubscription = async ($) => {
  const threadId = String($.path.thread_id);
  if (!$.context.getNotification(threadId)) return $.response[404].empty();
  return $.response[200].json(
    $.context.setThreadSubscription(threadId, { ignored: $.body.ignored }),
  );
};

export const DELETE: activityDeleteThreadSubscription = async ($) => {
  const threadId = String($.path.thread_id);
  if (!$.context.getNotification(threadId)) return $.response[404].empty();
  $.context.deleteThreadSubscription(threadId);
  return $.response[204].empty();
};
