import type { billingGetAllBudgetsOrg } from "../../../../../types/paths/organizations/{org}/settings/billing/budgets.types.js";

export const GET: billingGetAllBudgetsOrg = async ($) => {
  return $.response[200].empty();
};
