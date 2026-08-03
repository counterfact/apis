import type { customersList } from "../types/paths/customers.types.js";
import { paginate } from "../domain/pagination.js";

export const GET: customersList = async ($) => {
  let customers = $.context.state.customers;
  if ($.query.email !== undefined) {
    customers = customers.filter((entry) => entry.email === $.query.email);
  }
  if ($.query.live !== undefined) {
    const live = $.query.live.toLowerCase() === "true";
    customers = customers.filter((entry) => entry.live === live);
  }

  return $.response[200].json(
    paginate(customers, {
      headers: $.headers,
      path: "/customers/",
      query: $.query,
    }),
  );
};
