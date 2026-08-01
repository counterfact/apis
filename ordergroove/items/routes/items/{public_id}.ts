import type { retrieveItem } from "../../types/paths/items/{public_id}.types.js";
import type { deleteItem } from "../../types/paths/items/{public_id}.types.js";

// https://developer.ordergroove.com/reference/items-retrieve
export const GET: retrieveItem = async ($) => {
  const item = $.context.getItem($.path.public_id);
  return item
    ? $.response[200].json(item)
    : $.x.response[404].json({ error: "Item not found" });
};

// https://developer.ordergroove.com/reference/items-delete
// OpenAPI omits the public reference's /delete/ suffix; see
// DOCUMENTATION_DIFFERENCES.md.
export const DELETE: deleteItem = async ($) => {
  return $.context.deleteItem($.path.public_id)
    ? $.response[204].empty()
    : $.x.response[404].json({ error: "Item not found" });
};
