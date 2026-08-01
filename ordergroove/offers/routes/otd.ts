import type { listOneTimeDiscounts } from "../types/paths/otd.types.js";
import type { createOneTimeDiscount } from "../types/paths/otd.types.js";

// https://developer.ordergroove.com/reference/otd-list
// The authoritative OpenAPI uses /otd/ and declares no filters; see
// DOCUMENTATION_DIFFERENCES.md.
export const GET: listOneTimeDiscounts = async ($) => {
  return $.response[200].json({
    results: $.context.listOneTimeDiscounts(),
  });
};

// https://developer.ordergroove.com/reference/otd-create
// The authoritative OpenAPI uses /otd/ instead of the documented
// /one_time_incentives/create/ path.
export const POST: createOneTimeDiscount = async ($) => {
  return $.response[201].json($.context.createOneTimeDiscount($.body));
};
