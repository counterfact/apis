import type { activityGetThread } from "../../../types/paths/notifications/threads/{thread_id}.types.js";
import type { activityMarkThreadAsRead } from "../../../types/paths/notifications/threads/{thread_id}.types.js";
import type { activityMarkThreadAsDone } from "../../../types/paths/notifications/threads/{thread_id}.types.js";

export const GET: activityGetThread = async ($) => {
  return $.response[200].random();
};

export const PATCH: activityMarkThreadAsRead = async ($) => {
  return $.response[205].empty();
};

export const DELETE: activityMarkThreadAsDone = async ($) => {
  return $.response[204].empty();
};
