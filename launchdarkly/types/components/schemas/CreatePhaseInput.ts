import type { AudiencePost } from "./AudiencePost.js";

export type CreatePhaseInput = {
  /**
   * An ordered list of the audiences for this release phase. Each audience corresponds to a LaunchDarkly environment.
   */
  audiences: Array<AudiencePost>;
  /**
   * The release phase name
   * @example "Phase 1 - Testing"
   */
  name: string;
};
