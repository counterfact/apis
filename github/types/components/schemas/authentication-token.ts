import type { repository } from "./repository.js";

/**
 * Authentication Token
 */
export type authentication_token = {
  /**
   * The token used for authentication
   * @example "v1.1f699f1069f60xxx"
   */
  token: string;
  /**
   * The time this token expires
   * @format date-time
   * @example "2016-07-11T22:14:10Z"
   */
  expires_at: string;
  /**
   * @example {"issues":"read","deployments":"write"}
   */
  permissions?: {};
  /**
   * The repositories this token has access to
   */
  repositories?: Array<repository>;
  /**
   * @example "config.yaml"
   */
  single_file?: string;
  /**
   * Describe whether all repositories have been selected or there's a selection involved
   */
  repository_selection?: "all" | "selected";
};
