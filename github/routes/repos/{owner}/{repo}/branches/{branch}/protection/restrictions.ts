import type { reposGetAccessRestrictions } from "../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/restrictions.types.js";
import type { reposDeleteAccessRestrictions } from "../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/restrictions.types.js";

export const GET: reposGetAccessRestrictions = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposDeleteAccessRestrictions = async ($) => {
  return $.response[204].empty();
};
