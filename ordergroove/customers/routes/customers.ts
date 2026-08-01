import type { listCustomers } from "../types/paths/customers.types.js";
import type { createCustomer } from "../types/paths/customers.types.js";

export const GET: listCustomers = async ($) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.response[401].json({ error: "Unauthorized" });
  }

  return $.response[200].json({
    results: $.context.listCustomers(),
    next: null,
    previous: null,
  } as never);
};

export const POST: createCustomer = async ($) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.x.response[401].json({ error: "Unauthorized" });
  }

  return $.response[201].json($.context.createCustomer($.body));
};
