export type pages_https_certificate = {
  /**
   * @example "approved"
   */
  state:
    | "new"
    | "authorization_created"
    | "authorization_pending"
    | "authorized"
    | "authorization_revoked"
    | "issued"
    | "uploaded"
    | "approved"
    | "errored"
    | "bad_authz"
    | "destroy_pending"
    | "dns_changed";
  /**
   * @example "Certificate is approved"
   */
  description: string;
  /**
   * Array of the domain set and its alternate name (if it is configured)
   * @example ["example.com","www.example.com"]
   */
  domains: Array<string>;
  /**
   * @format date
   */
  expires_at?: string;
};
