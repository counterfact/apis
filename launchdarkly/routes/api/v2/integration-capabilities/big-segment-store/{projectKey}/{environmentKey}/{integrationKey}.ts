import type { createBigSegmentStoreIntegration } from "../../../../../../../types/paths/api/v2/integration-capabilities/big-segment-store/{projectKey}/{environmentKey}/{integrationKey}.types.js";

export const POST: createBigSegmentStoreIntegration = async ($) => {
  return $.response[201].random();
};
