import type { reposGetBranch } from "../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}.types.js";

export const GET: reposGetBranch = async ($) => {
  return $.response[200].random();
};
