export type UpdateBearerAuthRequest = {
  /**
   * @default "bearer_auth"
   */
  auth_type?: "bearer_auth";
  provider?: string | null;
  token?: string | null;
};
