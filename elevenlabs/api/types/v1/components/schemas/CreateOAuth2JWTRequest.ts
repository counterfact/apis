/**
 * Request model for creating OAuth2 JWT auth connections - inherits common settings and includes sensitive fields
 */
export type CreateOAuth2JWTRequest = {
  name: string;
  /**
   * @default "oauth2_jwt"
   */
  auth_type?: "oauth2_jwt";
  provider: string;
  /**
   * JWT signing algorithm
   * @default "HS256"
   */
  algorithm?: "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512";
  /**
   * Key ID (kid) for JWT header - useful for key rotation
   */
  key_id?: string | null;
  /**
   * JWT issuer (iss claim)
   */
  issuer: string;
  /**
   * JWT audience (aud claim)
   */
  audience: string;
  /**
   * JWT subject (sub claim)
   */
  subject: string;
  /**
   * Token expiration time in seconds
   * @default 3600
   */
  expiration_seconds?: number;
  /**
   * Additional custom claims to include in the JWT
   */
  extra_params?: { [key: string]: string };
  /**
   * Token endpoint URL for exchanging JWT for access token
   */
  token_url: string;
  /**
   * OAuth2 scopes to request when exchanging JWT for access token
   */
  scopes?: Array<string>;
  /**
   * Token field to extract from the token endpoint response.
   * @default "access_token"
   */
  token_response_field?: "access_token" | "id_token";
  secret_key: string;
};
