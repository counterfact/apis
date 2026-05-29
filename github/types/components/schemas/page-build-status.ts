/**
 * Page Build Status
 */
export type page_build_status = {
  /**
   * @format uri
   * @example "https://api.github.com/repos/github/hello-world/pages/builds/latest"
   */
  url: string;
  /**
   * @example "queued"
   */
  status: string;
};
