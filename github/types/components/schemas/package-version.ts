/**
 * A version of a software package
 */
export type package_version = {
  /**
   * Unique identifier of the package version.
   * @example 1
   */
  id: number;
  /**
   * The name of the package version.
   * @example "latest"
   */
  name: string;
  /**
   * @example "https://api.github.com/orgs/github/packages/container/super-linter/versions/786068"
   */
  url: string;
  /**
   * @example "https://github.com/orgs/github/packages/container/package/super-linter"
   */
  package_html_url: string;
  /**
   * @example "https://github.com/orgs/github/packages/container/super-linter/786068"
   */
  html_url?: string;
  /**
   * @example "MIT"
   */
  license?: string;
  description?: string;
  /**
   * @format date-time
   * @example "2011-04-10T20:09:31Z"
   */
  created_at: string;
  /**
   * @format date-time
   * @example "2014-03-03T18:58:10Z"
   */
  updated_at: string;
  /**
   * @format date-time
   * @example "2014-03-03T18:58:10Z"
   */
  deleted_at?: string;
  metadata?: {
    /**
     * @example "docker"
     */
    package_type:
      | "npm"
      | "maven"
      | "rubygems"
      | "docker"
      | "nuget"
      | "container";
    container?: { tags: Array<string> };
    docker?: { tag?: Array<string> };
  };
};
