/**
 * A GitHub user simplified for Classroom.
 */
export type simple_classroom_user = {
  /**
   * @example 1
   */
  id: number;
  /**
   * @example "octocat"
   */
  login: string;
  /**
   * @format uri
   * @example "https://github.com/images/error/octocat_happy.gif"
   */
  avatar_url: string;
  /**
   * @format uri
   * @example "https://github.com/octocat"
   */
  html_url: string;
};
