import type { reposGetCommunityProfileMetrics } from "../../../../../types/paths/repos/{owner}/{repo}/community/profile.types.js";

export const GET: reposGetCommunityProfileMetrics = async ($) => {
  return $.response[200].random();
};
