import type { SourceEnv } from "./SourceEnv.js";

export type EnvironmentPost = {
  /**
   * A human-friendly name for the new environment
   * @example "My Environment"
   */
  name: string;
  /**
   * A project-unique key for the new environment
   * @example "environment-key-123abc"
   */
  key: string;
  /**
   * A color to indicate this environment in the UI
   * @example "F5A623"
   */
  color: string;
  /**
   * The default time (in minutes) that the PHP SDK can cache feature flag rules locally
   * @example 5
   */
  defaultTtl?: number;
  /**
   * Ensures that one end user of the client-side SDK cannot inspect the variations for another end user
   * @example true
   */
  secureMode?: boolean;
  /**
   * Enables tracking detailed information for new flags by default
   * @example false
   */
  defaultTrackEvents?: boolean;
  /**
   * Requires confirmation for all flag and segment changes via the UI in this environment
   * @example false
   */
  confirmChanges?: boolean;
  /**
   * Requires comments for all flag and segment changes via the UI in this environment
   * @example false
   */
  requireComments?: boolean;
  /**
   * Tags to apply to the new environment
   * @example ["ops"]
   */
  tags?: Array<string>;
  /**
   * Indicates that the new environment created will be cloned from the provided source environment
   */
  source?: SourceEnv;
  /**
   * Whether the environment is critical
   * @example true
   */
  critical?: boolean;
};
