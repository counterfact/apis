import type { reposGetPagesBuild } from "../../../../../../types/paths/repos/{owner}/{repo}/pages/builds/{build_id}.types.js";

export const GET: reposGetPagesBuild = async ($) => {
  return $.response[200].random();
};
