import type { getTeamRoles } from "../../../../../types/paths/api/v2/teams/{teamKey}/roles.types.js";

export const GET: getTeamRoles = async ($) => {
  return $.response[200].random();
};
