import type { reposListPagesBuilds } from "../../../../../types/paths/repos/{owner}/{repo}/pages/builds.types.js";
import type { reposRequestPagesBuild } from "../../../../../types/paths/repos/{owner}/{repo}/pages/builds.types.js";

export const GET: reposListPagesBuilds = async ($) => {
  return $.response[200].random();
};

export const POST: reposRequestPagesBuild = async ($) => {
  return $.response[201].random();
};
