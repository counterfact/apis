import type { reposGetLatestPagesBuild } from "../../../../../../types/paths/repos/{owner}/{repo}/pages/builds/latest.types.js";

export const GET: reposGetLatestPagesBuild = async ($) => {
  return $.response[200].random();
};
