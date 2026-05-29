import type { billingGetBudgetOrg } from "../../../../../../types/paths/organizations/{org}/settings/billing/budgets/{budget_id}.types.js";
import type { billingUpdateBudgetOrg } from "../../../../../../types/paths/organizations/{org}/settings/billing/budgets/{budget_id}.types.js";
import type { billingDeleteBudgetOrg } from "../../../../../../types/paths/organizations/{org}/settings/billing/budgets/{budget_id}.types.js";

export const GET: billingGetBudgetOrg = async ($) => {
  return $.response[200].empty();
};

export const PATCH: billingUpdateBudgetOrg = async ($) => {
  return $.response[200].random();
};

export const DELETE: billingDeleteBudgetOrg = async ($) => {
  return $.response[200].empty();
};
