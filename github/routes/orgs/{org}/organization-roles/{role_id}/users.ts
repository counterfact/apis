import type { orgsListOrgRoleUsers } from "../../../../../types/paths/orgs/{org}/organization-roles/{role_id}/users.types.js";

export const GET: orgsListOrgRoleUsers = async ($) => {
  return $.response[200].random();
};
