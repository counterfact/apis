import type { usersListSocialAccountsForUser } from "../../../types/paths/users/{username}/social_accounts.types.js";

export const GET: usersListSocialAccountsForUser = async ($) => {
  return $.response[200].random();
};
