import type { reposGetParticipationStats } from "../../../../../types/paths/repos/{owner}/{repo}/stats/participation.types.js";

export const GET: reposGetParticipationStats = async ($) => {
  return $.response[200].random();
};
