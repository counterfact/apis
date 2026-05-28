/**
 * An object describing a submodule
 */
export type content_submodule = {
  type: "submodule";
  /**
   * @format uri
   */
  submodule_git_url: string;
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
