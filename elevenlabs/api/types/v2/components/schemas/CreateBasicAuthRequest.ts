/**
 * Request model for creating Basic Auth connections - inherits common settings and includes sensitive fields
 */
export type CreateBasicAuthRequest = {
  name: string;
  /**
   * @default "basic_auth"
   */
  auth_type?: "basic_auth";
  provider: string;
  username: string;
  password: string;
};
