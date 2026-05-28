import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { nullable_integration } from "./nullable-integration.js";

/**
 * A request for a specific ref(branch,sha,tag) to be deployed
 */
export type deployment = {
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/example/deployments/1"
   */
  url: string;
  /**
   * Unique identifier of the deployment
   * @format int64
   * @example 42
   */
  id: number;
  /**
   * @example "MDEwOkRlcGxveW1lbnQx"
   */
  node_id: string;
  /**
   * @example "a84d88e7554fc1fa21bcbc4efae3c782a70d2b9d"
   */
  sha: string;
  /**
   * The ref to deploy. This can be a branch, tag, or sha.
   * @example "topic-branch"
   */
  ref: string;
  /**
   * Parameter to specify a task to execute
   * @example "deploy"
   */
  task: string;
  payload: { [key: string]: unknown } | string;
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
  creator: nullable_simple_user;
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
