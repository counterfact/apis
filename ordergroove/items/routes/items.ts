import type { listItems } from "../types/paths/items.types.js";
import type { createItem } from "../types/paths/items.types.js";

export const GET: listItems = async ($) => {
  return $.response[200].json({
    results: $.context.listItems($.query),
    next: null,
    previous: null,
  } as never);
};

export const POST: createItem = async ($) => {
  return $.response[201].json($.context.createItem($.body));
};
