import type { activityGetThreadSubscriptionForAuthenticatedUser } from "../../../../types/paths/notifications/threads/{thread_id}/subscription.types.js";
import type { activitySetThreadSubscription } from "../../../../types/paths/notifications/threads/{thread_id}/subscription.types.js";
import type { activityDeleteThreadSubscription } from "../../../../types/paths/notifications/threads/{thread_id}/subscription.types.js";
import { notFound } from "../../../not-found.js";

export const GET: activityGetThreadSubscriptionForAuthenticatedUser = async (
  $,
) => {
  const threadId = String($.path.thread_id);
  if (!$.context.getNotification(threadId)) return notFound($.response);
  const subscription = $.context.getThreadSubscription(threadId);
  return subscription
    ? $.response[200].json(subscription)
    : notFound($.response);
};

export const PUT: activitySetThreadSubscription = async ($) => {
  const threadId = String($.path.thread_id);
  if (!$.context.getNotification(threadId)) return notFound($.response);
  return $.response[200].json(
    $.context.setThreadSubscription(threadId, { ignored: $.body.ignored }),
  );
};

export const DELETE: activityDeleteThreadSubscription = async ($) => {
  const threadId = String($.path.thread_id);
  if (!$.context.getNotification(threadId)) return notFound($.response);
  $.context.deleteThreadSubscription(threadId);
  return $.response[204].empty();
};
