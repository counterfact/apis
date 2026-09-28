export type ApprovalSettings = {
  /**
   * If approvals are required for this environment
   * @example true
   */
  required: boolean;
  /**
   * Whether to skip approvals for pending changes
   * @example false
   */
  bypassApprovalsForPendingChanges: boolean;
  /**
   * Sets the amount of approvals required before a member can apply a change. The minimum is one and the maximum is five.
   * @example 1
   */
  minNumApprovals: number;
  /**
   * Allow someone who makes an approval request to apply their own change
   * @example false
   */
  canReviewOwnRequest: boolean;
  /**
   * Allow applying the change as long as at least one person has approved
   * @example true
   */
  canApplyDeclinedChanges: boolean;
  /**
   * Which service to use for managing approvals
   * @example "launchdarkly"
   */
  serviceKind: string;
  /**
   * @example {}
   */
  serviceConfig: { [key: string]: unknown };
  /**
   * Require approval only on flags with the provided tags. Otherwise all flags will require approval.
   * @example ["require-approval"]
   */
  requiredApprovalTags: Array<string>;
};
