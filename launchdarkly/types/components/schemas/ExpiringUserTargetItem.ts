import type { UnixMillis } from "./UnixMillis.js";
import type { ResourceIDResponse } from "./ResourceIDResponse.js";

export type ExpiringUserTargetItem = {
  /**
   * The ID of this expiring user target
   * @example "12ab3c45de678910fgh12345"
   */
  _id: string;
  /**
   * The version of this expiring user target
   * @example 1
   */
  _version: number;
  /**
   * A timestamp for when the user target expires
   * @example "1658192820000"
   */
  expirationDate: UnixMillis;
  /**
   * A unique key used to represent the user
   * @example "example-user-key"
   */
  userKey: string;
  /**
   * A segment's target type. Included when expiring user targets are updated on a segment.
   * @example "included"
   */
  targetType?: string;
  /**
   * A unique key used to represent the flag variation. Included when expiring user targets are updated on a feature flag.
   * @example "ce67d625-a8b9-4fb5-a344-ab909d9d4f4d"
   */
  variationId?: string;
  /**
   * Details on the resource from which the user is expiring
   */
  _resourceId: ResourceIDResponse;
};
