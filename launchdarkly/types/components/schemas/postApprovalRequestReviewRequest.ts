export type postApprovalRequestReviewRequest = {
  /**
   * The type of review for this approval request
   * @example "approve"
   */
  kind?: "approve" | "comment" | "decline";
  /**
   * Optional comment about the approval request
   * @example "Looks good, thanks for updating"
   */
  comment?: string;
};
