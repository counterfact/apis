import type { activityGetThread } from "../../../types/paths/notifications/threads/{thread_id}.types.js";
import type { activityMarkThreadAsRead } from "../../../types/paths/notifications/threads/{thread_id}.types.js";
import type { activityMarkThreadAsDone } from "../../../types/paths/notifications/threads/{thread_id}.types.js";
import { notFound } from "../../not-found.js";

export const GET: activityGetThread = async ($) => {
  const notification = $.context.getNotification(String($.path.thread_id));
  return notification
    ? $.response[200].json(notification)
    : notFound($.response);
};

export const PATCH: activityMarkThreadAsRead = async ($) => {
  return $.context.markNotificationRead(String($.path.thread_id))
    ? $.response[205].empty()
    : notFound($.response);
};

export const DELETE: activityMarkThreadAsDone = async ($) => {
  return $.context.markNotificationDone(String($.path.thread_id))
    ? $.response[204].empty()
    : notFound($.response);
};
