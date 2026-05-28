import type { orgsGetMembershipForAuthenticatedUser } from "../../../../types/paths/user/memberships/orgs/{org}.types.js";
import type { orgsUpdateMembershipForAuthenticatedUser } from "../../../../types/paths/user/memberships/orgs/{org}.types.js";

export const GET: orgsGetMembershipForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

export const PATCH: orgsUpdateMembershipForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};
