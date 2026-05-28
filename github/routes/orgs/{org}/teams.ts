import type { teamsList } from "../../../types/paths/orgs/{org}/teams.types.js";
import type { teamsCreate } from "../../../types/paths/orgs/{org}/teams.types.js";

export const GET: teamsList = async ($) => {
  return $.response[200].random();
};

export const POST: teamsCreate = async ($) => {
  return $.response[201].random();
};
