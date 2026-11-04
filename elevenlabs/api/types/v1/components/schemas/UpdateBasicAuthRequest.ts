export type UpdateBasicAuthRequest = {
  /**
   * @default "basic_auth"
   */
  auth_type?: "basic_auth";
  provider?: string | null;
  username?: string | null;
  password?: string | null;
};
