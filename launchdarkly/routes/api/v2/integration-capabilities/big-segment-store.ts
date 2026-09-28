import type { getBigSegmentStoreIntegrations } from "../../../../types/paths/api/v2/integration-capabilities/big-segment-store.types.js";

export const GET: getBigSegmentStoreIntegrations = async ($) => {
  return $.response[200].random();
};
