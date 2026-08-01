import type { listSubscriptions } from "../types/paths/subscriptions.types.js";

export const GET: listSubscriptions = async ($) => {
  return $.response[200].json({
    results: $.context.listSubscriptions($.query),
    next: null,
    previous: null,
  } as never);
};
