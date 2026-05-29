import type { reposGetPagesHealthCheck } from "../../../../../types/paths/repos/{owner}/{repo}/pages/health.types.js";

export const GET: reposGetPagesHealthCheck = async ($) => {
  return $.response[200].random();
};
