import type { orgsCheckPublicMembershipForUser } from "../../../../types/paths/orgs/{org}/public_members/{username}.types.js";
import type { orgsSetPublicMembershipForAuthenticatedUser } from "../../../../types/paths/orgs/{org}/public_members/{username}.types.js";
import type { orgsRemovePublicMembershipForAuthenticatedUser } from "../../../../types/paths/orgs/{org}/public_members/{username}.types.js";

export const GET: orgsCheckPublicMembershipForUser = async ($) => {
  return $.response[204].empty();
};

export const PUT: orgsSetPublicMembershipForAuthenticatedUser = async ($) => {
  return $.response[204].empty();
};

export const DELETE: orgsRemovePublicMembershipForAuthenticatedUser = async (
  $,
) => {
  return $.response[204].empty();
};
