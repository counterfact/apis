import type { enterpriseTeamsList } from "../../../types/paths/enterprises/{enterprise}/teams.types.js";
import type { enterpriseTeamsCreate } from "../../../types/paths/enterprises/{enterprise}/teams.types.js";

export const GET: enterpriseTeamsList = async ($) => {
  return $.response[200].random();
};

export const POST: enterpriseTeamsCreate = async ($) => {
  return $.response[201].random();
};
