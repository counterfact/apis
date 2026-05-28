/**
 * An object describing a symlink
 */
export type content_symlink = {
  type: "symlink";
  target: string;
  size: number;
  name: string;
  path: string;
  sha: string;
  /**
   * @format uri
   */
  url: string;
  /**
   * @format uri
   */
  git_url: string;
  /**
   * @format uri
   */
  html_url: string;
  /**
   * @format uri
   */
  download_url: string;
  _links: {
    /**
     * @format uri
     */
    git: string;
    /**
     * @format uri
     */
    html: string;
    /**
     * @format uri
     */
    self: string;
  };
};
