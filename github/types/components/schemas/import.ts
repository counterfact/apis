/**
 * A repository import from an external source.
 */
export type import_ = {
  vcs: string;
  use_lfs?: boolean;
  /**
   * The URL of the originating repository.
   */
  vcs_url: string;
  svc_root?: string;
  tfvc_project?: string;
  status:
    | "auth"
    | "error"
    | "none"
    | "detecting"
    | "choose"
    | "auth_failed"
    | "importing"
    | "mapping"
    | "waiting_to_push"
    | "pushing"
    | "complete"
    | "setup"
    | "unknown"
    | "detection_found_multiple"
    | "detection_found_nothing"
    | "detection_needs_auth";
  status_text?: string;
  failed_step?: string;
  error_message?: string;
  import_percent?: number;
  commit_count?: number;
  push_percent?: number;
  has_large_files?: boolean;
  large_files_size?: number;
  large_files_count?: number;
  project_choices?: Array<{
    vcs?: string;
    tfvc_project?: string;
    human_name?: string;
  }>;
  message?: string;
  authors_count?: number;
  /**
   * @format uri
   */
  url: string;
  /**
   * @format uri
   */
  html_url: string;
  /**
   * @format uri
   */
  authors_url: string;
  /**
   * @format uri
   */
  repository_url: string;
  svn_root?: string;
};
