import type { getBigSegmentStoreIntegration } from "../../../../../../../../types/paths/api/v2/integration-capabilities/big-segment-store/{projectKey}/{environmentKey}/{integrationKey}/{integrationId}.types.js";
import type { patchBigSegmentStoreIntegration } from "../../../../../../../../types/paths/api/v2/integration-capabilities/big-segment-store/{projectKey}/{environmentKey}/{integrationKey}/{integrationId}.types.js";
import type { deleteBigSegmentStoreIntegration } from "../../../../../../../../types/paths/api/v2/integration-capabilities/big-segment-store/{projectKey}/{environmentKey}/{integrationKey}/{integrationId}.types.js";

export const GET: getBigSegmentStoreIntegration = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchBigSegmentStoreIntegration = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteBigSegmentStoreIntegration = async ($) => {
  return $.response[204].empty();
};
