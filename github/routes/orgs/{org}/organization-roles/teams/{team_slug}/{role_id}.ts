import type { orgsAssignTeamToOrgRole } from "../../../../../../types/paths/orgs/{org}/organization-roles/teams/{team_slug}/{role_id}.types.js";
import type { orgsRevokeOrgRoleTeam } from "../../../../../../types/paths/orgs/{org}/organization-roles/teams/{team_slug}/{role_id}.types.js";

export const PUT: orgsAssignTeamToOrgRole = async ($) => {
  return $.response[204].empty();
};

export const DELETE: orgsRevokeOrgRoleTeam = async ($) => {
  return $.response[204].empty();
};
