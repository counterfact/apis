import type { teamsListChildLegacy } from "../../../types/paths/teams/{team_id}/teams.types.js";

export const GET: teamsListChildLegacy = async ($) => {
  return $.response[200].random();
};
