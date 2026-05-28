import type { appsListSubscriptionsForAuthenticatedUser } from "../../types/paths/user/marketplace_purchases.types.js";

export const GET: appsListSubscriptionsForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};
