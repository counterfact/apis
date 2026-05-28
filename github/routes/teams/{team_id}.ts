import type { teamsGetLegacy } from "../../types/paths/teams/{team_id}.types.js";
import type { teamsUpdateLegacy } from "../../types/paths/teams/{team_id}.types.js";
import type { teamsDeleteLegacy } from "../../types/paths/teams/{team_id}.types.js";

export const GET: teamsGetLegacy = async ($) => {
  return $.response[200].random();
};

export const PATCH: teamsUpdateLegacy = async ($) => {
  return $.response[200].random();
};

export const DELETE: teamsDeleteLegacy = async ($) => {
  return $.response[204].empty();
};
