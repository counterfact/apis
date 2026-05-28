import type { reposGetBranchRules } from "../../../../../../types/paths/repos/{owner}/{repo}/rules/branches/{branch}.types.js";

export const GET: reposGetBranchRules = async ($) => {
  return $.response[200].random();
};
