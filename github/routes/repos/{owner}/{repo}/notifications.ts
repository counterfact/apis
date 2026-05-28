import type { activityListRepoNotificationsForAuthenticatedUser } from "../../../../types/paths/repos/{owner}/{repo}/notifications.types.js";
import type { activityMarkRepoNotificationsAsRead } from "../../../../types/paths/repos/{owner}/{repo}/notifications.types.js";

export const GET: activityListRepoNotificationsForAuthenticatedUser = async (
  $,
) => {
  return $.response[200].random();
};

export const PUT: activityMarkRepoNotificationsAsRead = async ($) => {
  return $.response[202].random();
};
