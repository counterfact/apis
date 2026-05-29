import type { reposGetCommitActivityStats } from "../../../../../types/paths/repos/{owner}/{repo}/stats/commit_activity.types.js";

export const GET: reposGetCommitActivityStats = async ($) => {
  return $.response[200].random();
};
