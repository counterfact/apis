import type { customersRetrieve } from "../../types/paths/customers/{merchant_user_id}.types.js";

export const GET: customersRetrieve = async ($) => {
  // Source: https://developer.ordergroove.com/reference/customers-retrieve
  const customer = $.context.store.getCustomer($.path.merchant_user_id);
  return customer
    ? $.response[200].json(customer)
    : $.response[404].json({ detail: "Unable to find requested asset." });
};
