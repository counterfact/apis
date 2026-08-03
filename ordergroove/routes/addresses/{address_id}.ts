import type { addressesRetrieve } from "../../types/paths/addresses/{address_id}.types.js";

export const GET: addressesRetrieve = async ($) => {
  return $.response[200].random();
};
