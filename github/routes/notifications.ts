import type { activityListNotificationsForAuthenticatedUser } from "../types/paths/notifications.types.js";
import type { activityMarkNotificationsAsRead } from "../types/paths/notifications.types.js";

export const GET: activityListNotificationsForAuthenticatedUser = async ($) => {
  return $.response[200].json($.context.listNotifications($.query));
};

export const PUT: activityMarkNotificationsAsRead = async ($) => {
  $.context.markAllNotificationsRead(undefined, undefined, $.body);
  return $.response[205].empty();
};
