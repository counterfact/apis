import type { teamsListMembersLegacy } from "../../../types/paths/teams/{team_id}/members.types.js";

export const GET: teamsListMembersLegacy = async ($) => {
  return $.response[200].random();
};
