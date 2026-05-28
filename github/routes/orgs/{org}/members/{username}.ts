import type { orgsCheckMembershipForUser } from "../../../../types/paths/orgs/{org}/members/{username}.types.js";
import type { orgsRemoveMember } from "../../../../types/paths/orgs/{org}/members/{username}.types.js";

export const GET: orgsCheckMembershipForUser = async ($) => {
  return $.response[204].empty();
};

export const DELETE: orgsRemoveMember = async ($) => {
  return $.response[204].empty();
};
