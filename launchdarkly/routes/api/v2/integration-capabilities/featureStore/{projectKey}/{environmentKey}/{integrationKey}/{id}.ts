import type { getIntegrationDeliveryConfigurationById } from "../../../../../../../../types/paths/api/v2/integration-capabilities/featureStore/{projectKey}/{environmentKey}/{integrationKey}/{id}.types.js";
import type { patchIntegrationDeliveryConfiguration } from "../../../../../../../../types/paths/api/v2/integration-capabilities/featureStore/{projectKey}/{environmentKey}/{integrationKey}/{id}.types.js";
import type { deleteIntegrationDeliveryConfiguration } from "../../../../../../../../types/paths/api/v2/integration-capabilities/featureStore/{projectKey}/{environmentKey}/{integrationKey}/{id}.types.js";

export const GET: getIntegrationDeliveryConfigurationById = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchIntegrationDeliveryConfiguration = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteIntegrationDeliveryConfiguration = async ($) => {
  return $.response[204].empty();
};
