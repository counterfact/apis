import type { simple_user } from "./simple-user.js";

/**
 * Minimal representation of an organization programmatic access grant for enumerations
 */
export type organization_programmatic_access_grant = {
  /**
   * Unique identifier of the fine-grained personal access token grant. The `pat_id` used to get details about an approved fine-grained personal access token.
   */
  id: number;
  owner: simple_user;
  /**
   * Type of repository selection requested.
   */
  repository_selection: "none" | "all" | "subset";
  /**
   * URL to the list of repositories the fine-grained personal access token can access. Only follow when `repository_selection` is `subset`.
   */
  repositories_url: string;
  /**
   * Permissions requested, categorized by type of permission.
   */
  permissions: {
    organization?: { [key: string]: string };
    repository?: { [key: string]: string };
    other?: { [key: string]: string };
  };
  /**
   * Date and time when the fine-grained personal access token was approved to access the organization.
   */
  access_granted_at: string;
  /**
   * Unique identifier of the user's token. This field can also be found in audit log events and the organization's settings for their PAT grants.
   */
  token_id: number;
  /**
   * The name given to the user's token. This field can also be found in an organization's settings page for Active Tokens.
   */
  token_name: string;
  /**
   * Whether the associated fine-grained personal access token has expired.
   */
  token_expired: boolean;
  /**
   * Date and time when the associated fine-grained personal access token expires.
   */
  token_expires_at: string;
  /**
   * Date and time when the associated fine-grained personal access token was last used for authentication.
   */
  token_last_used_at: string;
};
