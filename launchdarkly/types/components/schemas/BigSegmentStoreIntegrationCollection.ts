import type { BigSegmentStoreIntegrationCollectionLinks } from "./BigSegmentStoreIntegrationCollectionLinks.js";
import type { BigSegmentStoreIntegration } from "./BigSegmentStoreIntegration.js";

export type BigSegmentStoreIntegrationCollection = {
  /**
   * The location and content type of related resources
   */
  _links: BigSegmentStoreIntegrationCollectionLinks;
  /**
   * An array of persistent store integration configurations
   */
  items: Array<BigSegmentStoreIntegration>;
};
