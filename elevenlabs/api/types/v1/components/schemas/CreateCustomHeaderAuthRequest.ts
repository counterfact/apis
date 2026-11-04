export type CreateCustomHeaderAuthRequest = {
  name: string;
  /**
   * @default "custom_header_auth"
   */
  auth_type?: "custom_header_auth";
  provider: string;
  /**
   * The name of the header to use for authentication (e.g., 'x-api-key')
   */
  header_name: string;
  token: string;
};
