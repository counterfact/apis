/**
 * Request model for creating mTLS auth connections.
 */
export type CreateMTLSAuthRequest = {
  name: string;
  /**
   * @default "mtls"
   */
  auth_type?: "mtls";
  provider: string;
  client_certificate: string;
  client_key: string;
  ca_certificate?: string | null;
  key_passphrase?: string | null;
};
