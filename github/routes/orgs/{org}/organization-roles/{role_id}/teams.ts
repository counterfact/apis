import type { orgsListOrgRoleTeams } from "../../../../../types/paths/orgs/{org}/organization-roles/{role_id}/teams.types.js";

export const GET: orgsListOrgRoleTeams = async ($) => {
  return $.response[200].random();
};
