import type { reposGetTopPaths } from "../../../../../../types/paths/repos/{owner}/{repo}/traffic/popular/paths.types.js";

export const GET: reposGetTopPaths = async ($) => {
  return $.response[200].random();
};
