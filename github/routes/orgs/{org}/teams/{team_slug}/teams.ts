import type { teamsListChildInOrg } from "../../../../../types/paths/orgs/{org}/teams/{team_slug}/teams.types.js";

export const GET: teamsListChildInOrg = async ($) => {
  return $.response[200].random();
};
