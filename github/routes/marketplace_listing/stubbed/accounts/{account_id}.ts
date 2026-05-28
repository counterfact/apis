import type { appsGetSubscriptionPlanForAccountStubbed } from "../../../../types/paths/marketplace_listing/stubbed/accounts/{account_id}.types.js";

export const GET: appsGetSubscriptionPlanForAccountStubbed = async ($) => {
  return $.response[200].random();
};
