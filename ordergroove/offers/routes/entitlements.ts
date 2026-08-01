import type { listEntitlements } from "../types/paths/entitlements.types.js";

export const GET: listEntitlements = async ($) => {
  return $.response[200].random();
};
