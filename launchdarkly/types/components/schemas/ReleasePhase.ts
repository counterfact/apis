import type { UnixMillis } from "./UnixMillis.js";
import type { CompletedBy } from "./CompletedBy.js";
import type { ReleaseAudience } from "./ReleaseAudience.js";

export type ReleasePhase = {
  /**
   * The phase ID
   * @example "1234a56b7c89d012345e678f"
   */
  _id: string;
  /**
   * The release phase name
   * @example "Phase 1 - Testing"
   */
  _name: string;
  /**
   * Whether this phase is complete
   * @example true
   */
  complete: boolean;
  /**
   * Timestamp of when the release phase was created
   * @example "1684262711507"
   */
  _creationDate: UnixMillis;
  /**
   * Timestamp of when the release phase was completed
   * @example "1684262711509"
   */
  _completionDate?: UnixMillis;
  /**
   * Details about how this phase was marked as complete
   */
  _completedBy?: CompletedBy;
  /**
   * A logical grouping of one or more environments that share attributes for rolling out changes
   */
  _audiences: Array<ReleaseAudience>;
};
