import type { createIntegrationDeliveryConfiguration } from "../../../../../../../types/paths/api/v2/integration-capabilities/featureStore/{projectKey}/{environmentKey}/{integrationKey}.types.js";

export const POST: createIntegrationDeliveryConfiguration = async ($) => {
  return $.response[201].random();
};
