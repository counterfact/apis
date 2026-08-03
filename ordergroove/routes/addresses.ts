import type { addressesList } from "../types/paths/addresses.types.js";
import { paginate } from "../domain/pagination.ts";

export const GET: addressesList = async ($) => {
  // Source: https://developer.ordergroove.com/reference/addresses-list
  return $.response[200].json(
    paginate(
      $.context.store.listAddresses({
        customer: $.query.customer,
        // Counterfact validates the boolean but exposes the raw query string.
        live:
          $.x.query.live === undefined
            ? undefined
            : String($.x.query.live).toLowerCase() === "true",
      }),
      "addresses",
      Number($.x.query.page_size ?? 10),
      $.x.query.cursor,
    ),
  );
};
