import type { MergeProposalCloseReason } from "./MergeProposalCloseReason.js";
export type ClosedOutcome = {
  /**
   * @default "closed"
   */
  status?: "closed";
  reason: MergeProposalCloseReason;
  at: number;
  by_user_id: string | null;
};
