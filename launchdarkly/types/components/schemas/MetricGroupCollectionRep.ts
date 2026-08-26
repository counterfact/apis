import type { MetricGroupRep } from "./MetricGroupRep.js";

export type MetricGroupCollectionRep = {
  /**
   * An array of metric groups
   */
  items: Array<MetricGroupRep>;
  /**
   * The location and content type of related resources
   * @example {"parent":{"href":"/api/v2/projects/my-project","type":"application/json"},"self":{"href":"/api/v2/projects/my-project/metric-groups","type":"application/json"}}
   */
  _links?: { [key: string]: unknown };
};
