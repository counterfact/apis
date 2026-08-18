import type { activityListRepoNotificationsForAuthenticatedUser } from "../../../../types/paths/repos/{owner}/{repo}/notifications.types.js";
import type { activityMarkRepoNotificationsAsRead } from "../../../../types/paths/repos/{owner}/{repo}/notifications.types.js";

export const GET: activityListRepoNotificationsForAuthenticatedUser = async (
  $,
) => {
  return $.response[200].json(
    $.context.listNotifications({
      ...$.query,
      owner: $.path.owner,
      repo: $.path.repo,
    }),
  );
};

export const PUT: activityMarkRepoNotificationsAsRead = async ($) => {
  $.context.markAllNotificationsRead($.path.owner, $.path.repo);
  return $.response[202].empty();
};
