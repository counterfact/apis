/**
 * Repository Identifier
 */
export type code_scanning_variant_analysis_repository = {
  /**
   * A unique identifier of the repository.
   * @example 1296269
   */
  id: number;
  /**
   * The name of the repository.
   * @example "Hello-World"
   */
  name: string;
  /**
   * The full, globally unique, name of the repository.
   * @example "octocat/Hello-World"
   */
  full_name: string;
  /**
   * Whether the repository is private.
   */
  private: boolean;
  /**
   * @example 80
   */
  stargazers_count: number;
  /**
   * @format date-time
   * @example "2011-01-26T19:14:43Z"
   */
  updated_at: string;
};
