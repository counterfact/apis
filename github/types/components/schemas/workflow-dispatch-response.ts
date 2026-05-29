import type { workflow_run_id } from "./workflow-run-id.js";

/**
 * Response containing the workflow run ID and URLs.
 */
export type workflow_dispatch_response = {
  workflow_run_id: workflow_run_id;
  /**
   * The URL to the workflow run.
   * @format uri
   */
  run_url: string;
  /**
   * @format uri
   */
  html_url: string;
};
