import type { orgsCheckPublicMembershipForUser } from "../../../../types/paths/orgs/{org}/public_members/{username}.types.js";
import type { orgsSetPublicMembershipForAuthenticatedUser } from "../../../../types/paths/orgs/{org}/public_members/{username}.types.js";
import type { orgsRemovePublicMembershipForAuthenticatedUser } from "../../../../types/paths/orgs/{org}/public_members/{username}.types.js";

export const GET: orgsCheckPublicMembershipForUser = async ($) => {
  return $.context.isPublicMember($.path.org, $.path.username)
    ? $.response[204].empty()
    : $.response[404].empty();
};

export const PUT: orgsSetPublicMembershipForAuthenticatedUser = async ($) => {
  $.context.publicizeMembership($.path.org, $.path.username);
  return $.response[204].empty();
};

export const DELETE: orgsRemovePublicMembershipForAuthenticatedUser = async (
  $,
) => {
  $.context.concealMembership($.path.org, $.path.username);
  return $.response[204].empty();
};
