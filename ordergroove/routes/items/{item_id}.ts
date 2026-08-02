import type { itemsRetrieve } from "../../types/paths/items/{item_id}.types.js";

export const GET: itemsRetrieve = async ($) => {
  // Source: https://developer.ordergroove.com/reference/items-retrieve
  const item = $.context.store.getItem($.path.item_id);
  return item
    ? $.response[200].json(item)
    : $.response[404].json({ detail: "Unable to find requested asset." });
};
