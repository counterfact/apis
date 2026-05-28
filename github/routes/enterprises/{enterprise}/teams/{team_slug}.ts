import type { enterpriseTeamsGet } from "../../../../types/paths/enterprises/{enterprise}/teams/{team_slug}.types.js";
import type { enterpriseTeamsUpdate } from "../../../../types/paths/enterprises/{enterprise}/teams/{team_slug}.types.js";
import type { enterpriseTeamsDelete } from "../../../../types/paths/enterprises/{enterprise}/teams/{team_slug}.types.js";

export const GET: enterpriseTeamsGet = async ($) => {
  return $.response[200].random();
};

export const PATCH: enterpriseTeamsUpdate = async ($) => {
  return $.response[200].random();
};

export const DELETE: enterpriseTeamsDelete = async ($) => {
  return $.response[204].empty();
};
