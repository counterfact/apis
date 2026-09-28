import type { getMauUsage } from "../../../../types/paths/api/v2/usage/mau.types.js";

export const GET: getMauUsage = async ($) => {
  return $.response[200].random();
};
