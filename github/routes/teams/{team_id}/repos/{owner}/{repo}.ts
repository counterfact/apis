import type { teamsCheckPermissionsForRepoLegacy } from "../../../../../types/paths/teams/{team_id}/repos/{owner}/{repo}.types.js";
import type { teamsAddOrUpdateRepoPermissionsLegacy } from "../../../../../types/paths/teams/{team_id}/repos/{owner}/{repo}.types.js";
import type { teamsRemoveRepoLegacy } from "../../../../../types/paths/teams/{team_id}/repos/{owner}/{repo}.types.js";

export const GET: teamsCheckPermissionsForRepoLegacy = async ($) => {
  return $.response[200].random();
};

export const PUT: teamsAddOrUpdateRepoPermissionsLegacy = async ($) => {
  return $.response[204].empty();
};

export const DELETE: teamsRemoveRepoLegacy = async ($) => {
  return $.response[204].empty();
};
