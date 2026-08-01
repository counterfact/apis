import type { listCustomers } from "../types/paths/customers.types.js";
import type { createCustomer } from "../types/paths/customers.types.js";

// https://developer.ordergroove.com/reference/customers-list
// The public reference has filters absent from the authoritative OpenAPI; see
// DOCUMENTATION_DIFFERENCES.md.
export const GET: listCustomers = async ($) => {
  return $.response[200].json({
    results: $.context.listCustomers(),
    next: null,
    previous: null,
  } as never);
};

// https://developer.ordergroove.com/reference/customers-create
// OpenAPI declares this collection path and 201 response instead of the public
// reference's /customers/create/ path and 200; see DOCUMENTATION_DIFFERENCES.md.
export const POST: createCustomer = async ($) => {
  return $.response[201].json($.context.createCustomer($.body));
};
