import type { listEntitlements } from "../types/paths/entitlements.types.js";

// https://developer.ordergroove.com/reference/entitlements-list
// The OpenAPI customer filter differs from the public merchant/merchant_user_id
// parameters and remains authoritative; see DOCUMENTATION_DIFFERENCES.md.
export const GET: listEntitlements = async ($) => {
  return $.response[200].json({
    results: $.context.listEntitlements($.query.customer),
  });
};
