/**
 * A list of directory items
 */
export type content_directory = Array<{
  type: "dir" | "file" | "submodule" | "symlink";
  size: number;
  name: string;
  path: string;
  content?: string;
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
