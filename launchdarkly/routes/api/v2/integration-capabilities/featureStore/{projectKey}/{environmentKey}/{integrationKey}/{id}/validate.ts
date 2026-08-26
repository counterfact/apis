import type { validateIntegrationDeliveryConfiguration } from "../../../../../../../../../types/paths/api/v2/integration-capabilities/featureStore/{projectKey}/{environmentKey}/{integrationKey}/{id}/validate.types.js";

export const POST: validateIntegrationDeliveryConfiguration = async ($) => {
  return $.response[200].random();
};
