import type { reposGetLatestRelease } from "../../../../../types/paths/repos/{owner}/{repo}/releases/latest.types.js";

export const GET: reposGetLatestRelease = async ($) => {
  return $.response[200].random();
};
