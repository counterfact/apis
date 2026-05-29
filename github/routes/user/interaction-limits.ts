import type { interactionsGetRestrictionsForAuthenticatedUser } from "../../types/paths/user/interaction-limits.types.js";
import type { interactionsSetRestrictionsForAuthenticatedUser } from "../../types/paths/user/interaction-limits.types.js";
import type { interactionsRemoveRestrictionsForAuthenticatedUser } from "../../types/paths/user/interaction-limits.types.js";

export const GET: interactionsGetRestrictionsForAuthenticatedUser = async (
  $,
) => {
  return $.response[200].random();
};

export const PUT: interactionsSetRestrictionsForAuthenticatedUser = async (
  $,
) => {
  return $.response[200].random();
};

export const DELETE: interactionsRemoveRestrictionsForAuthenticatedUser =
  async ($) => {
    return $.response[204].empty();
  };
