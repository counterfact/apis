/**
 * Tag
 */
export type tag = {
  /**
   * @example "v0.1"
   */
  name: string;
  commit: {
    sha: string;
    /**
     * @format uri
     */
    url: string;
  };
  /**
   * @format uri
   * @example "https://github.com/octocat/Hello-World/zipball/v0.1"
   */
  zipball_url: string;
  /**
   * @format uri
   * @example "https://github.com/octocat/Hello-World/tarball/v0.1"
   */
  tarball_url: string;
  node_id: string;
};
