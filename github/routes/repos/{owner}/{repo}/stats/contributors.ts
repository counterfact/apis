import type { reposGetContributorsStats } from "../../../../../types/paths/repos/{owner}/{repo}/stats/contributors.types.js";

export const GET: reposGetContributorsStats = async ($) => {
  return $.response[200].random();
};
