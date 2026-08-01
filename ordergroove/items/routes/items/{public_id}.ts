import type { retrieveItem } from "../../types/paths/items/{public_id}.types.js";
import type { deleteItem } from "../../types/paths/items/{public_id}.types.js";

export const GET: retrieveItem = async ($) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.x.response[401].json({ error: "Unauthorized" });
  }

  const item = $.context.getItem($.path.public_id);
  return item
    ? $.response[200].json(item)
    : $.x.response[404].json({ error: "Item not found" });
};

export const DELETE: deleteItem = async ($) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.x.response[401].json({ error: "Unauthorized" });
  }

  return $.context.deleteItem($.path.public_id)
    ? $.response[204].empty()
    : $.x.response[404].json({ error: "Item not found" });
};
