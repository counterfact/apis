import type { itemsList } from "../types/paths/items.types.js";
import { paginate } from "../domain/pagination.ts";

export const GET: itemsList = async ($) => {
  // Source: https://developer.ordergroove.com/reference/items-list
  const items = $.context.store.listItems({
    order: $.query.order,
    subscription: $.query.subscription,
    product: $.query.product,
    one_time: $.query.one_time,
    status: $.query.status,
  });
  return $.response[200].json(
    paginate(
      items,
      "items",
      Number($.x.query.page_size ?? 10),
      $.x.query.cursor,
    ),
  );
};
