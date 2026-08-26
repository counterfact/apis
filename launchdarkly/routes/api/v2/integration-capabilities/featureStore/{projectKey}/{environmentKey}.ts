import type { getIntegrationDeliveryConfigurationByEnvironment } from "../../../../../../types/paths/api/v2/integration-capabilities/featureStore/{projectKey}/{environmentKey}.types.js";

export const GET: getIntegrationDeliveryConfigurationByEnvironment = async (
  $,
) => {
  return $.response[200].random();
};
