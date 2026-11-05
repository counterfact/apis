/**
 * Request model for creating auth connections - inherits common settings and includes sensitive fields
 */
export type CreateOAuth2ClientCredsRequest = {
  name: string;
  /**
   * @default "oauth2_client_credentials"
   */
  auth_type?: "oauth2_client_credentials";
  provider: string;
  client_id: string;
  token_url: string;
  /**
   * @default []
   */
  scopes?: Array<string>;
  /**
   * @default {}
   */
  extra_params?: { [key: string]: string };
  /**
   * If True, send client credentials in Authorization header as Basic Auth instead of request body
   * @default false
   */
  basic_auth_in_header?: boolean;
  client_secret: string;
  /**
   * @default {}
   */
  custom_headers?: { [key: string]: string };
};
