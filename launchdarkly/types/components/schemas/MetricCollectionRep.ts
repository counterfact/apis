import type { MetricListingRep } from "./MetricListingRep.js";

export type MetricCollectionRep = {
  /**
   * An array of metrics
   */
  items?: Array<MetricListingRep>;
  /**
   * The location and content type of related resources
   * @example {"self":{"href":"/api/v2/metrics/my-project?limit=20","type":"application/json"}}
   */
  _links?: { [key: string]: unknown };
};
