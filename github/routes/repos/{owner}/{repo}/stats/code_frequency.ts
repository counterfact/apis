import type { reposGetCodeFrequencyStats } from "../../../../../types/paths/repos/{owner}/{repo}/stats/code_frequency.types.js";

export const GET: reposGetCodeFrequencyStats = async ($) => {
  return $.response[200].random();
};
