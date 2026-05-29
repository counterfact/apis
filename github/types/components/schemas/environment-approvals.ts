import type { simple_user } from "./simple-user.js";

/**
 * An entry in the reviews log for environment deployments
 */
export type environment_approvals = {
  /**
   * The list of environments that were approved or rejected
   */
  environments: Array<{
    /**
     * The id of the environment.
     * @example 56780428
     */
    id?: number;
    /**
     * @example "MDExOkVudmlyb25tZW50NTY3ODA0Mjg="
     */
    node_id?: string;
    /**
     * The name of the environment.
     * @example "staging"
     */
    name?: string;
    /**
     * @example "https://api.github.com/repos/github/hello-world/environments/staging"
     */
    url?: string;
    /**
     * @example "https://github.com/github/hello-world/deployments/activity_log?environments_filter=staging"
     */
    html_url?: string;
    /**
     * The time that the environment was created, in ISO 8601 format.
     * @format date-time
     * @example "2020-11-23T22:00:40Z"
     */
    created_at?: string;
    /**
     * The time that the environment was last updated, in ISO 8601 format.
     * @format date-time
     * @example "2020-11-23T22:00:40Z"
     */
    updated_at?: string;
  }>;
  /**
   * Whether deployment to the environment(s) was approved or rejected or pending (with comments)
   * @example "approved"
   */
  state: "approved" | "rejected" | "pending";
  user: simple_user;
  /**
   * The comment submitted with the deployment review
   * @example "Ship it!"
   */
  comment: string;
};
