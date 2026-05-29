/**
 * Content Tree
 */
export type content_tree = {
  type: string;
  size: number;
  name: string;
  path: string;
  sha: string;
  content?: string;
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
  entries?: Array<{
    type: string;
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
  }>;
  encoding?: string;
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
