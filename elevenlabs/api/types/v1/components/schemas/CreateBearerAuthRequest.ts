/**
 * Request model for creating Bearer Auth connections - inherits common settings and includes sensitive fields
 */
export type CreateBearerAuthRequest = {
  name: string;
  /**
   * @default "bearer_auth"
   */
  auth_type?: "bearer_auth";
  provider: string;
  token: string;
};
