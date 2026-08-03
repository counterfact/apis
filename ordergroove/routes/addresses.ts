import type { addressesList } from "../types/paths/addresses.types.js";

export const GET: addressesList = async ($) => {
  return $.response[200].random();
};
