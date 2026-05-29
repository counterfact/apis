import type { orgsListOrgRoles } from "../../../types/paths/orgs/{org}/organization-roles.types.js";

export const GET: orgsListOrgRoles = async ($) => {
  return $.response[200].random();
};
