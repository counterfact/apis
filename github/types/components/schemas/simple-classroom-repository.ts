/**
 * A GitHub repository view for Classroom
 */
export type simple_classroom_repository = {
  /**
   * A unique identifier of the repository.
   * @example 1296269
   */
  id: number;
  /**
   * The full, globally unique name of the repository.
   * @example "octocat/Hello-World"
   */
  full_name: string;
  /**
   * The URL to view the repository on GitHub.com.
   * @format uri
   * @example "https://github.com/octocat/Hello-World"
   */
  html_url: string;
  /**
   * The GraphQL identifier of the repository.
   * @example "MDEwOlJlcG9zaXRvcnkxMjk2MjY5"
   */
  node_id: string;
  /**
   * Whether the repository is private.
   */
  private: boolean;
  /**
   * The default branch for the repository.
   * @example "main"
   */
  default_branch: string;
};
