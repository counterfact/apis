import type { listOneTimeDiscounts } from "../types/paths/otd.types.js";
import type { createOneTimeDiscount } from "../types/paths/otd.types.js";

export const GET: listOneTimeDiscounts = async ($) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.x.response[401].json({ error: "Unauthorized" });
  }

  return $.response[200].json({
    results: $.context.listOneTimeDiscounts(),
  });
};

export const POST: createOneTimeDiscount = async ($) => {
  if (!$.context.isAuthorized($.auth.apiKey)) {
    return $.x.response[401].json({ error: "Unauthorized" });
  }

  return $.response[201].json($.context.createOneTimeDiscount($.body));
};
