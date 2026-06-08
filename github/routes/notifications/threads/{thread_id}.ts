import type { activityGetThread } from "../../../types/paths/notifications/threads/{thread_id}.types.js";
import type { activityMarkThreadAsRead } from "../../../types/paths/notifications/threads/{thread_id}.types.js";
import type { activityMarkThreadAsDone } from "../../../types/paths/notifications/threads/{thread_id}.types.js";

export const GET: activityGetThread = async ($) => {
  const threadId = String($.path.thread_id);
  const notification = $.context.getNotification(threadId);
  if (!notification) {
    return $.response[404].empty();
  }
  return $.response[200].json(notification);
};

export const PATCH: activityMarkThreadAsRead = async ($) => {
  const threadId = String($.path.thread_id);
  if (!$.context.markNotificationRead(threadId)) {
    return $.response[404].empty();
  }
  return $.response[205].empty();
};

export const DELETE: activityMarkThreadAsDone = async ($) => {
  const threadId = String($.path.thread_id);
  if (!$.context.markNotificationDone(threadId)) {
    return $.response[404].empty();
  }
  return $.response[204].empty();
};
