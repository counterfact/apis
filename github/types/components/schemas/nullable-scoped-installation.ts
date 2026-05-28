import type { app_permissions } from "./app-permissions.js";
import type { simple_user } from "./simple-user.js";

export type nullable_scoped_installation = {
  permissions: app_permissions;
  /**
   * Describe whether all repositories have been selected or there's a selection involved
   */
  repository_selection: "all" | "selected";
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
   * @format uri
   * @example "https://api.github.com/users/octocat/repos"
   */
  repositories_url: string;
  account: simple_user;
};
