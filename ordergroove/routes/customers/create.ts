import type { customersCreate } from "../../types/paths/customers/create.types.js";

export const POST: customersCreate = async ($) => {
  if (
    $.context.state.customers.some(
      (entry) => entry.merchant_user_id === $.body.merchant_user_id,
    )
  ) {
    return $.response[400].json({ detail: "Customer already exists." });
  }

  $.context.state.customers.push($.body);
  return $.response[200].json($.body);
};
