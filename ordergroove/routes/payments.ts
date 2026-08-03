import type { paymentsList } from "../types/paths/payments.types.js";
import { paginate } from "../domain/pagination.ts";

export const GET: paymentsList = async ($) => {
  // Source: https://developer.ordergroove.com/reference/payments-list
  return $.response[200].json(
    paginate(
      $.context.store.listPayments({ customer: $.query.customer }),
      "payments",
      Number($.x.query.page_size ?? 10),
      $.x.query.cursor,
    ),
  );
};
