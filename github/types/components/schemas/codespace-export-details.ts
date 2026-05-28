/**
 * An export of a codespace. Also, latest export details for a codespace can be fetched with id = latest
 */
export type codespace_export_details = {
  /**
   * State of the latest export
   * @example "succeeded | failed | in_progress"
   */
  state?: string;
  /**
   * Completion time of the last export operation
   * @format date-time
   * @example "2021-01-01T19:01:12Z"
   */
  completed_at?: string;
  /**
   * Name of the exported branch
   * @example "codespace-monalisa-octocat-hello-world-g4wpq6h95q"
   */
  branch?: string;
  /**
   * Git commit SHA of the exported branch
   * @example "fd95a81ca01e48ede9f39c799ecbcef817b8a3b2"
   */
  sha?: string;
  /**
   * Id for the export details
   * @example "latest"
   */
  id?: string;
  /**
   * Url for fetching export details
   * @example "https://api.github.com/user/codespaces/:name/exports/latest"
   */
  export_url?: string;
  /**
   * Web url for the exported branch
   * @example "https://github.com/octocat/hello-world/tree/:branch"
   */
  html_url?: string;
};
