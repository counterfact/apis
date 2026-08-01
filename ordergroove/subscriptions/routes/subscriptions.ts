import type { listSubscriptions } from "../types/paths/subscriptions.types.js";

// https://developer.ordergroove.com/reference/subscriptions-list
// The implementation supports the filters declared by the authoritative local
// OpenAPI contract; documented filters omitted there are recorded in
// DOCUMENTATION_DIFFERENCES.md.
export const GET: listSubscriptions = async ($) => {
  return $.response[200].json({
    results: $.context.listSubscriptions($.query),
    next: null,
    previous: null,
  } as never);
};
