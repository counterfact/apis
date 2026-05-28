import type { reposGetStatusChecksProtection } from "../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks.types.js";
import type { reposUpdateStatusCheckProtection } from "../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks.types.js";
import type { reposRemoveStatusCheckProtection } from "../../../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks.types.js";

export const GET: reposGetStatusChecksProtection = async ($) => {
  return $.response[200].random();
};

export const PATCH: reposUpdateStatusCheckProtection = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposRemoveStatusCheckProtection = async ($) => {
  return $.response[204].empty();
};
