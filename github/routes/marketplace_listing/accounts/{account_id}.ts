import type { appsGetSubscriptionPlanForAccount } from "../../../types/paths/marketplace_listing/accounts/{account_id}.types.js";

export const GET: appsGetSubscriptionPlanForAccount = async ($) => {
  return $.response[200].random();
};
