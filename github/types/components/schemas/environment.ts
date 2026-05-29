import type { wait_timer } from "./wait-timer.js";
import type { deployment_reviewer_type } from "./deployment-reviewer-type.js";
import type { simple_user } from "./simple-user.js";
import type { team } from "./team.js";
import type { deployment_branch_policy_settings } from "./deployment-branch-policy-settings.js";

/**
 * Details of a deployment environment
 */
export type environment = {
  /**
   * The id of the environment.
   * @format int64
   * @example 56780428
   */
  id: number;
  /**
   * @example "MDExOkVudmlyb25tZW50NTY3ODA0Mjg="
   */
  node_id: string;
  /**
   * The name of the environment.
   * @example "staging"
   */
  name: string;
  /**
   * @example "https://api.github.com/repos/github/hello-world/environments/staging"
   */
  url: string;
  /**
   * @example "https://github.com/github/hello-world/deployments/activity_log?environments_filter=staging"
   */
  html_url: string;
  /**
   * The time that the environment was created, in ISO 8601 format.
   * @format date-time
   * @example "2020-11-23T22:00:40Z"
   */
  created_at: string;
  /**
   * The time that the environment was last updated, in ISO 8601 format.
   * @format date-time
   * @example "2020-11-23T22:00:40Z"
   */
  updated_at: string;
  /**
   * Built-in deployment protection rules for the environment.
   */
  protection_rules?: Array<
    | {
        /**
         * @example 3515
         */
        id: number;
        /**
         * @example "MDQ6R2F0ZTM1MTU="
         */
        node_id: string;
        /**
         * @example "wait_timer"
         */
        type: string;
        wait_timer?: wait_timer;
      }
    | {
        /**
         * @example 3755
         */
        id: number;
        /**
         * @example "MDQ6R2F0ZTM3NTU="
         */
        node_id: string;
        /**
         * Whether deployments to this environment can be approved by the user who created the deployment.
         * @example false
         */
        prevent_self_review?: boolean;
        /**
         * @example "required_reviewers"
         */
        type: string;
        /**
         * The people or teams that may approve jobs that reference the environment. You can list up to six users or teams as reviewers. The reviewers must have at least read access to the repository. Only one of the required reviewers needs to approve the job for it to proceed.
         */
        reviewers?: Array<{
          type?: deployment_reviewer_type;
          reviewer?: simple_user | team;
        }>;
      }
    | {
        /**
         * @example 3515
         */
        id: number;
        /**
         * @example "MDQ6R2F0ZTM1MTU="
         */
        node_id: string;
        /**
         * @example "branch_policy"
         */
        type: string;
      }
  >;
  deployment_branch_policy?: deployment_branch_policy_settings;
};
