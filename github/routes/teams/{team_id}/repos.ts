import type { teamsListReposLegacy } from "../../../types/paths/teams/{team_id}/repos.types.js";

export const GET: teamsListReposLegacy = async ($) => {
  return $.response[200].random();
};
