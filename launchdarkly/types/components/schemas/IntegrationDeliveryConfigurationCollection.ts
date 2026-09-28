import type { IntegrationDeliveryConfigurationCollectionLinks } from "./IntegrationDeliveryConfigurationCollectionLinks.js";
import type { IntegrationDeliveryConfiguration } from "./IntegrationDeliveryConfiguration.js";

export type IntegrationDeliveryConfigurationCollection = {
  /**
   * The location and content type of related resources
   */
  _links: IntegrationDeliveryConfigurationCollectionLinks;
  /**
   * An array of integration delivery configurations
   */
  items: Array<IntegrationDeliveryConfiguration>;
};
