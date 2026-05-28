import type { reposGetViews } from "../../../../../types/paths/repos/{owner}/{repo}/traffic/views.types.js";

export const GET: reposGetViews = async ($) => {
  return $.response[200].random();
};
