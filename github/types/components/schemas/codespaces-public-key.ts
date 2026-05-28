/**
 * The public key used for setting Codespaces secrets.
 */
export type codespaces_public_key = {
  /**
   * The identifier for the key.
   * @example "1234567"
   */
  key_id: string;
  /**
   * The Base64 encoded public key.
   * @example "hBT5WZEj8ZoOv6TYJsfWq7MxTEQopZO5/IT3ZCVQPzs="
   */
  key: string;
  /**
   * @example 2
   */
  id?: number;
  /**
   * @example "https://api.github.com/user/keys/2"
   */
  url?: string;
  /**
   * @example "ssh-rsa AAAAB3NzaC1yc2EAAA"
   */
  title?: string;
  /**
   * @example "2011-01-26T19:01:12Z"
   */
  created_at?: string;
};
