import type { orgsAddSecurityManagerTeam } from "../../../../../types/paths/orgs/{org}/security-managers/teams/{team_slug}.types.js";
import type { orgsRemoveSecurityManagerTeam } from "../../../../../types/paths/orgs/{org}/security-managers/teams/{team_slug}.types.js";

export const PUT: orgsAddSecurityManagerTeam = async ($) => {
  return $.response[204].empty();
};

export const DELETE: orgsRemoveSecurityManagerTeam = async ($) => {
  return $.response[204].empty();
};
