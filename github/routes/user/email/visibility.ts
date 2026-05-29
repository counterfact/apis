import type { usersSetPrimaryEmailVisibilityForAuthenticatedUser } from "../../../types/paths/user/email/visibility.types.js";

export const PATCH: usersSetPrimaryEmailVisibilityForAuthenticatedUser = async (
  $,
) => {
  return $.response[200].random();
};
