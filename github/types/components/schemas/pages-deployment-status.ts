export type pages_deployment_status = {
  /**
   * The current status of the deployment.
   */
  status?:
    | "deployment_in_progress"
    | "syncing_files"
    | "finished_file_sync"
    | "updating_pages"
    | "purging_cdn"
    | "deployment_cancelled"
    | "deployment_failed"
    | "deployment_content_failed"
    | "deployment_attempt_error"
    | "deployment_lost"
    | "succeed";
};
