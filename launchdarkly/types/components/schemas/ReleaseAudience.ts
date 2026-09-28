import type { EnvironmentSummary } from "./EnvironmentSummary.js";

export type ReleaseAudience = {
  /**
   * Details about the environment
   */
  environment: EnvironmentSummary;
  /**
   * The release phase name
   * @example "Phase 1 - Testing"
   */
  name: string;
};
