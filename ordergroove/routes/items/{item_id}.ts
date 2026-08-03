import type { itemsRetrieve } from "../../types/paths/items/{item_id}.types.js";

export const GET: itemsRetrieve = async ($) => {
  const item = $.context.state.items.find(
    (entry) => entry.public_id === $.path.item_id,
  );
  return item
    ? $.response[200].json(item)
    : $.response[404].json({ detail: "Unable to find requested asset." });
};
