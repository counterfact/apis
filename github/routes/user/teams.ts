import type { teamsListForAuthenticatedUser } from "../../types/paths/user/teams.types.js";

export const GET: teamsListForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};
