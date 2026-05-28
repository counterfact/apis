import type { orgsAssignUserToOrgRole } from "../../../../../../types/paths/orgs/{org}/organization-roles/users/{username}/{role_id}.types.js";
import type { orgsRevokeOrgRoleUser } from "../../../../../../types/paths/orgs/{org}/organization-roles/users/{username}/{role_id}.types.js";

export const PUT: orgsAssignUserToOrgRole = async ($) => {
  return $.response[204].empty();
};

export const DELETE: orgsRevokeOrgRoleUser = async ($) => {
  return $.response[204].empty();
};
