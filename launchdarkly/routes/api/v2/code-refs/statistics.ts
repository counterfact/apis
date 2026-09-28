import type { getRootStatistic } from "../../../../types/paths/api/v2/code-refs/statistics.types.js";

export const GET: getRootStatistic = async ($) => {
  return $.response[200].random();
};
