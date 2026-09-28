import type { getTeam } from "../../../../types/paths/api/v2/teams/{teamKey}.types.js";
import type { patchTeam } from "../../../../types/paths/api/v2/teams/{teamKey}.types.js";
import type { deleteTeam } from "../../../../types/paths/api/v2/teams/{teamKey}.types.js";

export const GET: getTeam = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchTeam = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteTeam = async ($) => {
  return $.response[204].empty();
};
