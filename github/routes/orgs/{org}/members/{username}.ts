import type { orgsCheckMembershipForUser } from "../../../../types/paths/orgs/{org}/members/{username}.types.js";
import type { orgsRemoveMember } from "../../../../types/paths/orgs/{org}/members/{username}.types.js";

export const GET: orgsCheckMembershipForUser = async ($) => {
  return $.context.isOrgMember($.path.org, $.path.username)
    ? $.response[204].empty()
    : $.response[404].empty();
};

export const DELETE: orgsRemoveMember = async ($) => {
  return $.context.removeOrgMember($.path.org, $.path.username)
    ? $.response[204].empty()
    : $.response[404].empty();
};
