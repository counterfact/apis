import type { UnixMillis } from "./UnixMillis.js";
import type { ResourceId } from "./ResourceId.js";

export type ExpiringTarget = {
  /**
   * The ID of this expiring target
   * @example "12ab3c45de678910abc12345"
   */
  _id: string;
  /**
   * The version of this expiring target
   * @example 1
   */
  _version: number;
  /**
   * A timestamp for when the target expires
   * @example "1672358400000"
   */
  expirationDate: UnixMillis;
  /**
   * The context kind of the context to be removed
   * @example "user"
   */
  contextKind: string;
  /**
   * A unique key used to represent the context to be removed
   * @example "context-key-123abc"
   */
  contextKey: string;
  /**
   * A segment's target type, <code>included</code> or <code>excluded</code>. Included when expiring targets are updated on a segment.
   * @example "included"
   */
  targetType?: string;
  /**
   * A unique ID used to represent the flag variation. Included when expiring targets are updated on a feature flag.
   * @example "cc4332e2-bd4d-4fe0-b509-dfd2caf8dd73"
   */
  variationId?: string;
  /**
   * Details on the segment or flag this expiring target belongs to, its environment, and its project
   */
  _resourceId: ResourceId;
};
