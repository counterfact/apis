import type { activityListNotificationsForAuthenticatedUser } from "../types/paths/notifications.types.js";
import type { activityMarkNotificationsAsRead } from "../types/paths/notifications.types.js";

export const GET: activityListNotificationsForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

export const PUT: activityMarkNotificationsAsRead = async ($) => {
  return $.response[202].random();
};
