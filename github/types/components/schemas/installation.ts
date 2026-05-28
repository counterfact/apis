import type { simple_user } from "./simple-user.js";
import type { enterprise } from "./enterprise.js";
import type { app_permissions } from "./app-permissions.js";
import type { nullable_simple_user } from "./nullable-simple-user.js";

/**
 * Installation
 */
export type installation = {
  /**
   * The ID of the installation.
   * @example 1
   */
  id: number;
  account: simple_user | enterprise;
  /**
   * Describe whether all repositories have been selected or there's a selection involved
   */
  repository_selection: "all" | "selected";
  /**
   * @format uri
   * @example "https://api.github.com/app/installations/1/access_tokens"
   */
  access_tokens_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/installation/repositories"
   */
  repositories_url: string;
  /**
   * @format uri
   * @example "https://github.com/organizations/github/settings/installations/1"
   */
  html_url: string;
  /**
   * @example 1
   */
  app_id: number;
  /**
   * @example "Iv1.ab1112223334445c"
   */
  client_id?: string;
  /**
   * The ID of the user or organization this token is being scoped to.
   */
  target_id: number;
  /**
   * @example "Organization"
   */
  target_type: string;
  permissions: app_permissions;
  events: Array<string>;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
  /**
   * @example "config.yaml"
   */
  single_file_name: string;
  /**
   * @example true
   */
  has_multiple_single_files?: boolean;
  /**
   * @example ["config.yml",".github/issue_TEMPLATE.md"]
   */
  single_file_paths?: Array<string>;
  /**
   * @example "github-actions"
   */
  app_slug: string;
  suspended_by: nullable_simple_user;
  /**
   * @format date-time
   */
  suspended_at: string;
  /**
   * @example "\"test_13f1e99741e3e004@d7e1eb0bc0a1ba12.com\""
   */
  contact_email?: string;
};
