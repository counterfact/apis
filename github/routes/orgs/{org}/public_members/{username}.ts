import type { orgsCheckPublicMembershipForUser } from "../../../../types/paths/orgs/{org}/public_members/{username}.types.js";
import type { orgsSetPublicMembershipForAuthenticatedUser } from "../../../../types/paths/orgs/{org}/public_members/{username}.types.js";
import type { orgsRemovePublicMembershipForAuthenticatedUser } from "../../../../types/paths/orgs/{org}/public_members/{username}.types.js";
import { forbidden } from "../../../not-found.js";

const isAuthenticatedUser = (authenticatedLogin: string, username: string) =>
  authenticatedLogin.toLowerCase() === username.toLowerCase();

export const GET: orgsCheckPublicMembershipForUser = async ($) => {
  return $.context.isPublicMember($.path.org, $.path.username)
    ? $.response[204].empty()
    : $.response[404].empty();
};

export const PUT: orgsSetPublicMembershipForAuthenticatedUser = async ($) => {
  if (!isAuthenticatedUser($.context.authenticatedLogin(), $.path.username)) {
    return forbidden($.response);
  }
  $.context.publicizeMembership($.path.org, $.path.username);
  return $.response[204].empty();
};

export const DELETE: orgsRemovePublicMembershipForAuthenticatedUser = async (
  $,
) => {
  if (!isAuthenticatedUser($.context.authenticatedLogin(), $.path.username)) {
    return forbidden($.response);
  }
  $.context.concealMembership($.path.org, $.path.username);
  return $.response[204].empty();
};
