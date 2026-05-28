import type { reposGetUsersWithAccessToProtectedBranch } from "../../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users.types.js";
import type { reposAddUserAccessRestrictions } from "../../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users.types.js";
import type { reposSetUserAccessRestrictions } from "../../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users.types.js";
import type { reposRemoveUserAccessRestrictions } from "../../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users.types.js";

export const GET: reposGetUsersWithAccessToProtectedBranch = async ($) => {
  return $.response[200].random();
};

export const POST: reposAddUserAccessRestrictions = async ($) => {
  return $.response[200].random();
};

export const PUT: reposSetUserAccessRestrictions = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposRemoveUserAccessRestrictions = async ($) => {
  return $.response[200].random();
};
