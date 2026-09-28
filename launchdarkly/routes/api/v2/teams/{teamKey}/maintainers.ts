import type { getTeamMaintainers } from "../../../../../types/paths/api/v2/teams/{teamKey}/maintainers.types.js";

export const GET: getTeamMaintainers = async ($) => {
  return $.response[200].random();
};
