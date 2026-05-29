import type { activityListStargazersForRepo } from "../../../../types/paths/repos/{owner}/{repo}/stargazers.types.js";

export const GET: activityListStargazersForRepo = async ($) => {
  return $.response[200].random();
};
