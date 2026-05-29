import type { reposGetAdminBranchProtection } from "../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins.types.js";
import type { reposSetAdminBranchProtection } from "../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins.types.js";
import type { reposDeleteAdminBranchProtection } from "../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins.types.js";

export const GET: reposGetAdminBranchProtection = async ($) => {
  return $.response[200].random();
};

export const POST: reposSetAdminBranchProtection = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposDeleteAdminBranchProtection = async ($) => {
  return $.response[204].empty();
};
