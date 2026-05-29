import type { reposGetClones } from "../../../../../types/paths/repos/{owner}/{repo}/traffic/clones.types.js";

export const GET: reposGetClones = async ($) => {
  return $.response[200].random();
};
