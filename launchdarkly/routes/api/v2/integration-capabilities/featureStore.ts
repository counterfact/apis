import type { getIntegrationDeliveryConfigurations } from "../../../../types/paths/api/v2/integration-capabilities/featureStore.types.js";

export const GET: getIntegrationDeliveryConfigurations = async ($) => {
  return $.response[200].random();
};
