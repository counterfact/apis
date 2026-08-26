import type { FeatureFlag } from "./FeatureFlag.js";

export type FeatureFlags = {
  /**
   * An array of feature flags
   */
  items: Array<FeatureFlag>;
  /**
   * The location and content type of related resources
   * @example {"self":{"href":"/api/v2/flags/default","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
  /**
   * The total number of flags
   * @example 1
   */
  totalCount?: number;
  /**
   * The number of flags that have differences between environments. Only shown when query parameter <code>compare</code> is <code>true</code>.
   * @example 0
   */
  totalCountWithDifferences?: number;
};
