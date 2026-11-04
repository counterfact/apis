import type { MergeProposalReviewState } from "./MergeProposalReviewState.js";
export type Body_Review_a_merge_proposal_v1_convai_agents__agent_id__merge_proposals__merge_proposal_id__reviews_post =
  {
    /**
     * The review verdict.
     */
    state: MergeProposalReviewState;
    /**
     * Optional comment to leave with the review.
     * @default ""
     */
    comment?: string;
  };
