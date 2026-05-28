import type { actionsGetActionsCacheUsage } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/cache/usage.types.js";

export const GET: actionsGetActionsCacheUsage = async ($) => {
  return $.response[200].random();
};
