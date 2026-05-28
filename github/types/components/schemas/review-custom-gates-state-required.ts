export type review_custom_gates_state_required = {
  /**
   * The name of the environment to approve or reject.
   */
  environment_name: string;
  /**
   * Whether to approve or reject deployment to the specified environments.
   */
  state: "approved" | "rejected";
  /**
   * Optional comment to include with the review.
   */
  comment?: string;
};
