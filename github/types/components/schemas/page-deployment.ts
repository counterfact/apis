/**
 * The GitHub Pages deployment status.
 */
export type page_deployment = {
  /**
   * The ID of the GitHub Pages deployment. This is the Git SHA of the deployed commit.
   */
  id: number | string;
  /**
   * The URI to monitor GitHub Pages deployment status.
   * @format uri
   * @example "https://api.github.com/repos/github/hello-world/pages/deployments/4fd754f7e594640989b406850d0bc8f06a121251"
   */
  status_url: string;
  /**
   * The URI to the deployed GitHub Pages.
   * @format uri
   * @example "hello-world.github.io"
   */
  page_url: string;
  /**
   * The URI to the deployed GitHub Pages preview.
   * @format uri
   * @example "monalisa-1231a2312sa32-23sda74.drafts.github.io"
   */
  preview_url?: string;
};
