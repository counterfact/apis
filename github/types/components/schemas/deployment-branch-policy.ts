/**
 * Details of a deployment branch or tag policy.
 */
export type deployment_branch_policy = {
  /**
   * The unique identifier of the branch or tag policy.
   * @example 361471
   */
  id?: number;
  /**
   * @example "MDE2OkdhdGVCcmFuY2hQb2xpY3kzNjE0NzE="
   */
  node_id?: string;
  /**
   * The name pattern that branches or tags must match in order to deploy to the environment.
   * @example "release/*"
   */
  name?: string;
  /**
   * Whether this rule targets a branch or tag.
   * @example "branch"
   */
  type?: "branch" | "tag";
};
