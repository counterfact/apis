import type { reposListBranches } from "../../../../types/paths/repos/{owner}/{repo}/branches.types.js";

export const GET: reposListBranches = async ($) => {
  return $.response[200].random();
};
