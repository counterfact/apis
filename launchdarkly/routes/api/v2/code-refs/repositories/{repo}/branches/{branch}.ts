import type { getBranch } from "../../../../../../../types/paths/api/v2/code-refs/repositories/{repo}/branches/{branch}.types.js";
import type { putBranch } from "../../../../../../../types/paths/api/v2/code-refs/repositories/{repo}/branches/{branch}.types.js";

export const GET: getBranch = async ($) => {
  return $.response[200].random();
};

export const PUT: putBranch = async ($) => {
  return $.response[200].empty();
};
