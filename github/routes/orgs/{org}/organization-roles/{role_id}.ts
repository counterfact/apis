import type { orgsGetOrgRole } from "../../../../types/paths/orgs/{org}/organization-roles/{role_id}.types.js";

export const GET: orgsGetOrgRole = async ($) => {
  return $.response[200].random();
};
