import type { MergeProposalReview } from "./MergeProposalReview.js";
import type { MergeProposalComment } from "./MergeProposalComment.js";
import type { OpenOutcome } from "./OpenOutcome.js";
import type { MergedOutcome } from "./MergedOutcome.js";
import type { ClosedOutcome } from "./ClosedOutcome.js";
import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
export type AgentMergeProposalResponse = {
  id: string;
  agent_id: string;
  source_branch_id: string;
  target_branch_id: string;
  source_tip_version_id_at_creation: string;
  title: string;
  /**
   * @default ""
   */
  description?: string;
  requested_reviewer_user_ids?: Array<string>;
  reviews?: Array<MergeProposalReview>;
  comments?: Array<MergeProposalComment>;
  outcome?:
    | (OpenOutcome & { status: "open" })
    | (MergedOutcome & { status: "merged" })
    | (ClosedOutcome & { status: "closed" });
  created_at: number;
  updated_at: number;
  /**
   * User ID of the merge_proposal's author.
   */
  author_user_id?: string | null;
  /**
   * Access information for the merge_proposal, including creator.
   */
  access_info?: ResourceAccessInfo | null;
};
