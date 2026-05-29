/**
 * Set secrets for GitHub Actions.
 */
export type actions_secret = {
  /**
   * The name of the secret.
   * @example "SECRET_TOKEN"
   */
  name: string;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
};
