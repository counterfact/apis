import type { retrieveCustomer } from "../../types/paths/customers/{public_id}.types.js";
import type { updateCustomer } from "../../types/paths/customers/{public_id}.types.js";

// https://developer.ordergroove.com/reference/customers-retrieve
export const GET: retrieveCustomer = async ($) => {
  const customer = $.context.getCustomer($.path.public_id);
  return customer
    ? $.response[200].json(customer)
    : $.x.response[404].json({ error: "Customer not found" });
};

// https://developer.ordergroove.com/reference/update
// OpenAPI's PUT replacement by public_id takes precedence over the documented
// PATCH /update operation by merchant_user_id; see DOCUMENTATION_DIFFERENCES.md.
export const PUT: updateCustomer = async ($) => {
  const customer = $.context.replaceCustomer($.path.public_id, $.body);
  return customer
    ? $.response[200].json(customer)
    : $.x.response[404].json({ error: "Customer not found" });
};
