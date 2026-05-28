import type { reposGetBranchProtection } from "../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection.types.js";
import type { reposUpdateBranchProtection } from "../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection.types.js";
import type { reposDeleteBranchProtection } from "../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection.types.js";

export const GET: reposGetBranchProtection = async ($) => {
  return $.response[200].random();
};

export const PUT: reposUpdateBranchProtection = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposDeleteBranchProtection = async ($) => {
  return $.response[204].empty();
};
