/**
 * Email
 */
export type email = {
  /**
   * @format email
   * @example "octocat@github.com"
   */
  email: string;
  /**
   * @example true
   */
  primary: boolean;
  /**
   * @example true
   */
  verified: boolean;
  /**
   * @example "public"
   */
  visibility: string;
};
