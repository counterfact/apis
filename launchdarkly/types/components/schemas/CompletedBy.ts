import type { MemberSummary } from "./MemberSummary.js";
import type { TokenSummary } from "./TokenSummary.js";

export type CompletedBy = {
  /**
   * The LaunchDarkly member who marked this phase as complete
   */
  member?: MemberSummary;
  /**
   * The service token used to mark this phase as complete
   */
  token?: TokenSummary;
};
