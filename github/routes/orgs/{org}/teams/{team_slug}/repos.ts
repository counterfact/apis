import type { teamsListReposInOrg } from "../../../../../types/paths/orgs/{org}/teams/{team_slug}/repos.types.js";

export const GET: teamsListReposInOrg = async ($) => {
  return $.response[200].random();
};
