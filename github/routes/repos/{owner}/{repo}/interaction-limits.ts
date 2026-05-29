import type { interactionsGetRestrictionsForRepo } from "../../../../types/paths/repos/{owner}/{repo}/interaction-limits.types.js";
import type { interactionsSetRestrictionsForRepo } from "../../../../types/paths/repos/{owner}/{repo}/interaction-limits.types.js";
import type { interactionsRemoveRestrictionsForRepo } from "../../../../types/paths/repos/{owner}/{repo}/interaction-limits.types.js";

export const GET: interactionsGetRestrictionsForRepo = async ($) => {
  return $.response[200].random();
};

export const PUT: interactionsSetRestrictionsForRepo = async ($) => {
  return $.response[200].random();
};

export const DELETE: interactionsRemoveRestrictionsForRepo = async ($) => {
  return $.response[204].empty();
};
