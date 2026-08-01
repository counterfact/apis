import type { listCustomers } from "../types/paths/customers.types.js";
import type { createCustomer } from "../types/paths/customers.types.js";

export const GET: listCustomers = async ($) => {
  return $.response[200].json({
    results: $.context.listCustomers(),
    next: null,
    previous: null,
  } as never);
};

export const POST: createCustomer = async ($) => {
  return $.response[201].json($.context.createCustomer($.body));
};
