import type { MergeProposalReviewState } from "./MergeProposalReviewState.js";
export type MergeProposalReview = {
  user_id: string;
  state: MergeProposalReviewState;
  submitted_at: number;
  /**
   * @default ""
   */
  comment?: string;
  reviewer_role?: ("admin" | "editor" | "commenter" | "viewer") | null;
};
