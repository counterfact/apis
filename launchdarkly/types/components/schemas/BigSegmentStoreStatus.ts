import type { UnixMillis } from "./UnixMillis.js";
import type { StoreIntegrationError } from "./StoreIntegrationError.js";

export type BigSegmentStoreStatus = {
  /**
   * Whether the persistent store integration is fully synchronized with the LaunchDarkly environment, and the <code>lastSync</code> occurred within a few minutes
   * @example true
   */
  available?: boolean;
  /**
   * Whether the persistent store integration may not be fully synchronized with the LaunchDarkly environment. <code>true</code> if the integration could be stale.
   * @example false
   */
  potentiallyStale?: boolean;
  /**
   * Timestamp of when the most recent successful sync occurred between the persistent store integration and the LaunchDarkly environment.
   * @example "1717263000000"
   */
  lastSync?: UnixMillis;
  /**
   * Timestamp of when the most recent synchronization error occurred, if any
   * @example "1714584600000"
   */
  lastError?: UnixMillis;
  errors?: Array<StoreIntegrationError>;
};
