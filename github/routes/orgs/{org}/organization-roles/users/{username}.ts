import type { orgsRevokeAllOrgRolesUser } from "../../../../../types/paths/orgs/{org}/organization-roles/users/{username}.types.js";

export const DELETE: orgsRevokeAllOrgRolesUser = async ($) => {
  return $.response[204].empty();
};
