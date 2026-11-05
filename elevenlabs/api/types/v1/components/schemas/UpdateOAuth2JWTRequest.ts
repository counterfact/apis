export type UpdateOAuth2JWTRequest = {
  /**
   * @default "oauth2_jwt"
   */
  auth_type?: "oauth2_jwt";
  provider?: string | null;
  algorithm?:
    ("HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512") | null;
  key_id?: string | null;
  issuer?: string | null;
  audience?: string | null;
  subject?: string | null;
  expiration_seconds?: number | null;
  extra_params?: { [key: string]: string } | null;
  scopes?: Array<string> | null;
  token_response_field?: ("access_token" | "id_token") | null;
  secret_key?: string | null;
};
