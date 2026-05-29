import type { reposListTeams } from "../../../../types/paths/repos/{owner}/{repo}/teams.types.js";

export const GET: reposListTeams = async ($) => {
  return $.response[200].random();
};
