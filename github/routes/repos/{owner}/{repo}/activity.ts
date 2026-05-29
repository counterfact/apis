import type { reposListActivities } from "../../../../types/paths/repos/{owner}/{repo}/activity.types.js";

export const GET: reposListActivities = async ($) => {
  return $.response[200].random();
};
