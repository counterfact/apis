import type { retrieveCustomer } from "../../types/paths/customers/{public_id}.types.js";
import type { updateCustomer } from "../../types/paths/customers/{public_id}.types.js";

export const GET: retrieveCustomer = async ($) => {
  const customer = $.context.getCustomer($.path.public_id);
  return customer
    ? $.response[200].json(customer)
    : $.x.response[404].json({ error: "Customer not found" });
};

export const PUT: updateCustomer = async ($) => {
  const customer = $.context.replaceCustomer($.path.public_id, $.body);
  return customer
    ? $.response[200].json(customer)
    : $.x.response[404].json({ error: "Customer not found" });
};
