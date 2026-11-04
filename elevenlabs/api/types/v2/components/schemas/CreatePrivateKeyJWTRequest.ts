/**
 * Request model for creating Private Key JWT auth connections - inherits common settings and includes sensitive fields
 */
export type CreatePrivateKeyJWTRequest = {
  name: string;
  /**
   * @default "private_key_jwt"
   */
  auth_type?: "private_key_jwt";
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
  secret_key: string;
};
