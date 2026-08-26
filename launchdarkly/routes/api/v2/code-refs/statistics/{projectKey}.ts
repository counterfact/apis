import type { getStatistics } from "../../../../../types/paths/api/v2/code-refs/statistics/{projectKey}.types.js";

export const GET: getStatistics = async ($) => {
  return $.response[200].random();
};
