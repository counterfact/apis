import type { usersListSocialAccountsForAuthenticatedUser } from "../../types/paths/user/social_accounts.types.js";
import type { usersAddSocialAccountForAuthenticatedUser } from "../../types/paths/user/social_accounts.types.js";
import type { usersDeleteSocialAccountForAuthenticatedUser } from "../../types/paths/user/social_accounts.types.js";

export const GET: usersListSocialAccountsForAuthenticatedUser = async ($) => {
  return $.response[200].json($.context.listSocialAccounts($.query));
};

export const POST: usersAddSocialAccountForAuthenticatedUser = async ($) => {
  return $.response[201].json($.context.addSocialAccounts($.body.account_urls));
};

export const DELETE: usersDeleteSocialAccountForAuthenticatedUser = async (
  $,
) => {
  $.context.deleteSocialAccounts($.body.account_urls);
  return $.response[204].empty();
};
