import type { app_permissions } from "./app-permissions.js";
import type { repository } from "./repository.js";

/**
 * Authentication token for a GitHub App installed on a user or org.
 */
export type installation_token = {
  token: string;
  expires_at: string;
  permissions?: app_permissions;
  repository_selection?: "all" | "selected";
  repositories?: Array<repository>;
  /**
   * @example "README.md"
   */
  single_file?: string;
  /**
   * @example true
   */
  has_multiple_single_files?: boolean;
  /**
   * @example ["config.yml",".github/issue_TEMPLATE.md"]
   */
  single_file_paths?: Array<string>;
};
