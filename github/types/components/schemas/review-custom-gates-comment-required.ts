export type review_custom_gates_comment_required = {
  /**
   * The name of the environment to approve or reject.
   */
  environment_name: string;
  /**
   * Comment associated with the pending deployment protection rule. **Required when state is not provided.**
   */
  comment: string;
};
