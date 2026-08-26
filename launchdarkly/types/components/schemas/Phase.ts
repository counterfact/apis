import type { Audiences } from "./Audiences.js";

export type Phase = {
  /**
   * The phase ID
   * @example "1234a56b7c89d012345e678f"
   */
  id: string;
  /**
   * An ordered list of the audiences for this release phase. Each audience corresponds to a LaunchDarkly environment.
   */
  audiences: Audiences;
  /**
   * The release phase name
   * @example "Phase 1 - Testing"
   */
  name: string;
};
