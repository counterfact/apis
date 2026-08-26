import type { StatementPost } from "./StatementPost.js";

export type AccessTokenPost = {
  /**
   * A human-friendly name for the access token
   */
  name?: string;
  /**
   * A description for the access token
   */
  description?: string;
  /**
   * Built-in role for the token
   */
  role?: "reader" | "writer" | "admin";
  /**
   * A list of custom role IDs to use as access limits for the access token
   */
  customRoleIds?: Array<string>;
  /**
   * A JSON array of statements represented as JSON objects with three attributes: effect, resources, actions. May be used in place of a built-in or custom role.
   */
  inlineRole?: Array<StatementPost>;
  /**
   * Whether the token is a service token https://docs.launchdarkly.com/home/account/api#service-tokens
   */
  serviceToken?: boolean;
  /**
   * The default API version for this token
   */
  defaultApiVersion?: number;
};
