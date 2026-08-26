export type oauthClientPost = {
  /**
   * The name of your new LaunchDarkly OAuth 2.0 client.
   */
  name?: string;
  /**
   * The redirect URI for your new OAuth 2.0 application. This should be an absolute URL conforming with the standard HTTPS protocol.
   */
  redirectUri?: string;
  /**
   * Description of your OAuth 2.0 client.
   */
  description?: string;
};
