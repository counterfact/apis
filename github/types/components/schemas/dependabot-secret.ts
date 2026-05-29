/**
 * Set secrets for Dependabot.
 */
export type dependabot_secret = {
  /**
   * The name of the secret.
   * @example "MY_ARTIFACTORY_PASSWORD"
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
