export type UpdateOAuth2ClientCredsRequest = {
  /**
   * @default "oauth2_client_credentials"
   */
  auth_type?: "oauth2_client_credentials";
  provider?: string | null;
  client_id?: string | null;
  scopes?: Array<string> | null;
  extra_params?: { [key: string]: string } | null;
  basic_auth_in_header?: boolean | null;
  client_secret?: string | null;
  custom_headers?: { [key: string]: string } | null;
};
