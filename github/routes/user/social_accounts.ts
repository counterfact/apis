import type { usersListSocialAccountsForAuthenticatedUser } from "../../types/paths/user/social_accounts.types.js";
import type { usersAddSocialAccountForAuthenticatedUser } from "../../types/paths/user/social_accounts.types.js";
import type { usersDeleteSocialAccountForAuthenticatedUser } from "../../types/paths/user/social_accounts.types.js";

export const GET: usersListSocialAccountsForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

export const POST: usersAddSocialAccountForAuthenticatedUser = async ($) => {
  return $.response[201].random();
};

export const DELETE: usersDeleteSocialAccountForAuthenticatedUser = async (
  $,
) => {
  return $.response[204].empty();
};
