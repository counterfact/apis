import type { appsListAccountsForPlan } from "../../../../types/paths/marketplace_listing/plans/{plan_id}/accounts.types.js";

export const GET: appsListAccountsForPlan = async ($) => {
  return $.response[200].random();
};
