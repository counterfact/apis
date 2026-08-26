import type { getDestinations } from "../../../types/paths/api/v2/destinations.types.js";

export const GET: getDestinations = async ($) => {
  return $.response[200].random();
};
