/**
 * Content File
 */
export type content_file = {
  type: "file";
  encoding: string;
  size: number;
  name: string;
  path: string;
  content: string;
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
  /**
   * @example "\"actual/actual.md\""
   */
  target?: string;
  /**
   * @example "\"git://example.com/defunkt/dotjs.git\""
   */
  submodule_git_url?: string;
};
