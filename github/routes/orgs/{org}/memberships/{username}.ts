import type { orgsGetMembershipForUser } from "../../../../types/paths/orgs/{org}/memberships/{username}.types.js";
import type { orgsSetMembershipForUser } from "../../../../types/paths/orgs/{org}/memberships/{username}.types.js";
import type { orgsRemoveMembershipForUser } from "../../../../types/paths/orgs/{org}/memberships/{username}.types.js";

export const GET: orgsGetMembershipForUser = async ($) => {
  return $.response[200].random();
};

export const PUT: orgsSetMembershipForUser = async ($) => {
  return $.response[200].random();
};

export const DELETE: orgsRemoveMembershipForUser = async ($) => {
  return $.response[204].empty();
};
