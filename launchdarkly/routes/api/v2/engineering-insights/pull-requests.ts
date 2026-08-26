import type { getPullRequests } from "../../../../types/paths/api/v2/engineering-insights/pull-requests.types.js";

export const GET: getPullRequests = async ($) => {
  return $.response[200].random();
};
