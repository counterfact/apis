import type { nullable_integration } from "./nullable-integration.js";

/**
 * A deployment created as the result of an Actions check run from a workflow that references an environment
 */
export type deployment_simple = {
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/example/deployments/1"
   */
  url: string;
  /**
   * Unique identifier of the deployment
   * @example 42
   */
  id: number;
  /**
   * @example "MDEwOkRlcGxveW1lbnQx"
   */
  node_id: string;
  /**
   * Parameter to specify a task to execute
   * @example "deploy"
   */
  task: string;
  /**
   * @example "staging"
   */
  original_environment?: string;
  /**
   * Name for the target deployment environment.
   * @example "production"
   */
  environment: string;
  /**
   * @example "Deploy request from hubot"
   */
  description: string;
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
   * @example "https://api.github.com/repos/octocat/example/deployments/1/statuses"
   */
  statuses_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/example"
   */
  repository_url: string;
  /**
   * Specifies if the given environment is will no longer exist at some point in the future. Default: false.
   * @example true
   */
  transient_environment?: boolean;
  /**
   * Specifies if the given environment is one that end-users directly interact with. Default: false.
   * @example true
   */
  production_environment?: boolean;
  performed_via_github_app?: nullable_integration;
};
