/**
 * A GitHub organization.
 */
export type simple_classroom_organization = {
  /**
   * @example 1
   */
  id: number;
  /**
   * @example "github"
   */
  login: string;
  /**
   * @example "MDEyOk9yZ2FuaXphdGlvbjE="
   */
  node_id: string;
  /**
   * @format uri
   * @example "https://github.com/github"
   */
  html_url: string;
  /**
   * @example "Github - Code thigns happen here"
   */
  name: string;
  /**
   * @example "https://github.com/images/error/octocat_happy.gif"
   */
  avatar_url: string;
};
