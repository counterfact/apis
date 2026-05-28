import type { teamsCheckPermissionsForRepoInOrg } from "../../../../../../../types/paths/orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}.types.js";
import type { teamsAddOrUpdateRepoPermissionsInOrg } from "../../../../../../../types/paths/orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}.types.js";
import type { teamsRemoveRepoInOrg } from "../../../../../../../types/paths/orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}.types.js";

export const GET: teamsCheckPermissionsForRepoInOrg = async ($) => {
  return $.response[200].random();
};

export const PUT: teamsAddOrUpdateRepoPermissionsInOrg = async ($) => {
  return $.response[204].empty();
};

export const DELETE: teamsRemoveRepoInOrg = async ($) => {
  return $.response[204].empty();
};
