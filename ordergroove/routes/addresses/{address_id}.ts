import type { addressesRetrieve } from "../../types/paths/addresses/{address_id}.types.js";

export const GET: addressesRetrieve = async ($) => {
  // Source: https://developer.ordergroove.com/reference/addresses-retrieve
  const address = $.context.store.getAddress($.path.address_id);
  return address
    ? $.response[200].json(address)
    : $.response[404].json({ detail: "Unable to find requested asset." });
};
