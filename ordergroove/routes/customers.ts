import type { customersList } from "../types/paths/customers.types.js";
import { paginate } from "../domain/pagination.ts";

export const GET: customersList = async ($) => {
  // Source: https://developer.ordergroove.com/reference/customers-list
  const customers = $.context.store.listCustomers({
    email: $.query.email,
    live: $.query.live,
  });
  return $.response[200].json(
    paginate(
      customers,
      "customers",
      Number($.x.query.page_size ?? 10),
      $.x.query.cursor,
    ),
  );
};
