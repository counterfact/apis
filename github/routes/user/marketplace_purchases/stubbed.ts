import type { appsListSubscriptionsForAuthenticatedUserStubbed } from "../../../types/paths/user/marketplace_purchases/stubbed.types.js";

export const GET: appsListSubscriptionsForAuthenticatedUserStubbed = async (
  $,
) => {
  return $.response[200].random();
};
