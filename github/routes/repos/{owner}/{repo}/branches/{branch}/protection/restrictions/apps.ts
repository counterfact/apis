import type { reposGetAppsWithAccessToProtectedBranch } from "../../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps.types.js";
import type { reposAddAppAccessRestrictions } from "../../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps.types.js";
import type { reposSetAppAccessRestrictions } from "../../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps.types.js";
import type { reposRemoveAppAccessRestrictions } from "../../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps.types.js";

export const GET: reposGetAppsWithAccessToProtectedBranch = async ($) => {
  return $.response[200].random();
};

export const POST: reposAddAppAccessRestrictions = async ($) => {
  return $.response[200].random();
};

export const PUT: reposSetAppAccessRestrictions = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposRemoveAppAccessRestrictions = async ($) => {
  return $.response[200].random();
};
