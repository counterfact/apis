import type { getMauSdksByType } from "../../../../../types/paths/api/v2/usage/mau/sdks.types.js";

export const GET: getMauSdksByType = async ($) => {
  return $.response[200].random();
};
