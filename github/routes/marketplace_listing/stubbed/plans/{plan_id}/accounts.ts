import type { appsListAccountsForPlanStubbed } from "../../../../../types/paths/marketplace_listing/stubbed/plans/{plan_id}/accounts.types.js";

export const GET: appsListAccountsForPlanStubbed = async ($) => {
  return $.response[200].random();
};
