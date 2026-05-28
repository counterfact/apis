import type { interactionsGetRestrictionsForOrg } from "../../../types/paths/orgs/{org}/interaction-limits.types.js";
import type { interactionsSetRestrictionsForOrg } from "../../../types/paths/orgs/{org}/interaction-limits.types.js";
import type { interactionsRemoveRestrictionsForOrg } from "../../../types/paths/orgs/{org}/interaction-limits.types.js";

export const GET: interactionsGetRestrictionsForOrg = async ($) => {
  return $.response[200].random();
};

export const PUT: interactionsSetRestrictionsForOrg = async ($) => {
  return $.response[200].random();
};

export const DELETE: interactionsRemoveRestrictionsForOrg = async ($) => {
  return $.response[204].empty();
};
