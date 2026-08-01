import type { listItems } from "../types/paths/items.types.js";
import type { createItem } from "../types/paths/items.types.js";

// https://developer.ordergroove.com/reference/items-list
// Only the OpenAPI-declared order and subscription filters are implemented.
export const GET: listItems = async ($) => {
  return $.response[200].json({
    results: $.context.listItems($.query),
    next: null,
    previous: null,
  } as never);
};

// https://developer.ordergroove.com/reference/items-create
// OpenAPI declares POST /items/ with an Item body, which takes precedence over
// the documented /items/create/ operation; see DOCUMENTATION_DIFFERENCES.md.
export const POST: createItem = async ($) => {
  return $.response[201].json($.context.createItem($.body));
};
