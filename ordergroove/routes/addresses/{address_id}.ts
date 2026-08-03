import type { addressesRetrieve } from "../../types/paths/addresses/{address_id}.types.js";

export const GET: addressesRetrieve = async ($) => {
  const address = $.context.state.addresses.find(
    (entry) => entry.public_id === $.path.address_id,
  );
  return address
    ? $.response[200].json(address)
    : $.response[404].json({ detail: "Unable to find requested asset." });
};
