/**
 * The public key used for setting Dependabot Secrets.
 */
export type dependabot_public_key = {
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
};
