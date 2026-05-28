import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { nullable_integration } from "./nullable-integration.js";

/**
 * The status of a deployment.
 */
export type deployment_status = {
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/example/deployments/42/statuses/1"
   */
  url: string;
  /**
   * @format int64
   * @example 1
   */
  id: number;
  /**
   * @example "MDE2OkRlcGxveW1lbnRTdGF0dXMx"
   */
  node_id: string;
  /**
   * The state of the status.
   * @example "success"
   */
  state:
    | "error"
    | "failure"
    | "inactive"
    | "pending"
    | "success"
    | "queued"
    | "in_progress";
  creator: nullable_simple_user;
  /**
   * A short description of the status.
   * @default ""
   * @example "Deployment finished successfully."
   */
  description: string;
  /**
   * The environment of the deployment that the status is for.
   * @default ""
   * @example "production"
   */
  environment?: string;
  /**
   * Closing down notice: the URL to associate with this status.
   * @format uri
   * @default ""
   * @example "https://example.com/deployment/42/output"
   */
  target_url: string;
  /**
   * @format date-time
   * @example "2012-07-20T01:19:13Z"
   */
  created_at: string;
  /**
   * @format date-time
   * @example "2012-07-20T01:19:13Z"
   */
  updated_at: string;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/example/deployments/42"
   */
  deployment_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/example"
   */
  repository_url: string;
  /**
   * The URL for accessing your environment.
   * @format uri
   * @default ""
   * @example "https://staging.example.com/"
   */
  environment_url?: string;
  /**
   * The URL to associate with this status.
   * @format uri
   * @default ""
   * @example "https://example.com/deployment/42/output"
   */
  log_url?: string;
  performed_via_github_app?: nullable_integration;
};
