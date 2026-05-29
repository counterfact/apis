import type { orgsRevokeAllOrgRolesTeam } from "../../../../../types/paths/orgs/{org}/organization-roles/teams/{team_slug}.types.js";

export const DELETE: orgsRevokeAllOrgRolesTeam = async ($) => {
  return $.response[204].empty();
};
