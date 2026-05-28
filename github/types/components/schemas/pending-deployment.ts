import type { deployment_reviewer_type } from "./deployment-reviewer-type.js";
import type { simple_user } from "./simple-user.js";
import type { team } from "./team.js";

/**
 * Details of a deployment that is waiting for protection rules to pass
 */
export type pending_deployment = {
  environment: {
    /**
     * The id of the environment.
     * @format int64
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
  };
  /**
   * The set duration of the wait timer
   * @example 30
   */
  wait_timer: number;
  /**
   * The time that the wait timer began.
   * @format date-time
   * @example "2020-11-23T22:00:40Z"
   */
  wait_timer_started_at: string;
  /**
   * Whether the currently authenticated user can approve the deployment
   * @example true
   */
  current_user_can_approve: boolean;
  /**
   * The people or teams that may approve jobs that reference the environment. You can list up to six users or teams as reviewers. The reviewers must have at least read access to the repository. Only one of the required reviewers needs to approve the job for it to proceed.
   */
  reviewers: Array<{
    type?: deployment_reviewer_type;
    reviewer?: simple_user | team;
  }>;
};
