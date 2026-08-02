import type { subscriptionsList } from "../types/paths/subscriptions.types.js";
import { paginate } from "../domain/pagination.ts";

export const GET: subscriptionsList = async ($) => {
  // Source: https://developer.ordergroove.com/reference/subscriptions-list
  const subscriptions = $.context.store.listSubscriptions({
    customer: $.query.customer,
    product: $.query.product,
    live: $.query.live,
  });
  return $.response[200].json(
    paginate(
      subscriptions,
      "subscriptions",
      Number($.x.query.page_size ?? 10),
      $.x.query.cursor,
    ),
  );
};
