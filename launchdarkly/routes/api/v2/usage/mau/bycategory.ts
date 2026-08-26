import type { getMauUsageByCategory } from "../../../../../types/paths/api/v2/usage/mau/bycategory.types.js";

export const GET: getMauUsageByCategory = async ($) => {
  return $.response[200].random();
};
