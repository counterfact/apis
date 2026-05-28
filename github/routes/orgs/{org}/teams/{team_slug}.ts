import type { teamsGetByName } from "../../../../types/paths/orgs/{org}/teams/{team_slug}.types.js";
import type { teamsUpdateInOrg } from "../../../../types/paths/orgs/{org}/teams/{team_slug}.types.js";
import type { teamsDeleteInOrg } from "../../../../types/paths/orgs/{org}/teams/{team_slug}.types.js";

export const GET: teamsGetByName = async ($) => {
  return $.response[200].random();
};

export const PATCH: teamsUpdateInOrg = async ($) => {
  return $.response[200].random();
};

export const DELETE: teamsDeleteInOrg = async ($) => {
  return $.response[204].empty();
};
