import type { FlagStatusRep } from "./FlagStatusRep.js";

export type FeatureFlagStatuses = {
  /**
   * @example {"self":{"href":"/api/v2/flag-statuses/my-project/my-environment","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
  items?: Array<FlagStatusRep>;
};
