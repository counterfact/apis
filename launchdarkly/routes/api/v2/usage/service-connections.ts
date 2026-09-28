import type { getServiceConnectionUsage } from "../../../../types/paths/api/v2/usage/service-connections.types.js";

export const GET: getServiceConnectionUsage = async ($) => {
  return $.response[200].random();
};
