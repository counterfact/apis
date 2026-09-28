import type { FeatureFlagScheduledChange } from "./FeatureFlagScheduledChange.js";

export type FeatureFlagScheduledChanges = {
  /**
   * Array of scheduled changes
   */
  items: Array<FeatureFlagScheduledChange>;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
};
