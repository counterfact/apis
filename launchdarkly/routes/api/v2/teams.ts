import type { getTeams } from "../../../types/paths/api/v2/teams.types.js";
import type { postTeam } from "../../../types/paths/api/v2/teams.types.js";
import type { patchTeams } from "../../../types/paths/api/v2/teams.types.js";

export const GET: getTeams = async ($) => {
  return $.response[200].random();
};

export const POST: postTeam = async ($) => {
  return $.response[201].random();
};

export const PATCH: patchTeams = async ($) => {
  return $.response[200].random();
};
