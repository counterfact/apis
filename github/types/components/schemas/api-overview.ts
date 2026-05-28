/**
 * Api Overview
 */
export type api_overview = {
  /**
   * @example true
   */
  verifiable_password_authentication: boolean;
  ssh_key_fingerprints?: {
    SHA256_RSA?: string;
    SHA256_DSA?: string;
    SHA256_ECDSA?: string;
    SHA256_ED25519?: string;
  };
  /**
   * @example ["ssh-ed25519 ABCDEFGHIJKLMNOPQRSTUVWXYZ"]
   */
  ssh_keys?: Array<string>;
  /**
   * @example ["192.0.2.1"]
   */
  hooks?: Array<string>;
  /**
   * @example ["192.0.2.1"]
   */
  github_enterprise_importer?: Array<string>;
  /**
   * @example ["192.0.2.1"]
   */
  web?: Array<string>;
  /**
   * @example ["192.0.2.1"]
   */
  api?: Array<string>;
  /**
   * @example ["192.0.2.1"]
   */
  git?: Array<string>;
  /**
   * @example ["192.0.2.1"]
   */
  packages?: Array<string>;
  /**
   * @example ["192.0.2.1"]
   */
  pages?: Array<string>;
  /**
   * @example ["192.0.2.1"]
   */
  importer?: Array<string>;
  /**
   * @example ["192.0.2.1"]
   */
  actions?: Array<string>;
  /**
   * @example ["192.0.2.1"]
   */
  actions_macos?: Array<string>;
  /**
   * @example ["192.0.2.1"]
   */
  codespaces?: Array<string>;
  /**
   * @example ["192.0.2.1"]
   */
  dependabot?: Array<string>;
  /**
   * @example ["192.0.2.1"]
   */
  copilot?: Array<string>;
  domains?: {
    website?: Array<string>;
    codespaces?: Array<string>;
    copilot?: Array<string>;
    packages?: Array<string>;
    actions?: Array<string>;
    actions_inbound?: {
      full_domains?: Array<string>;
      wildcard_domains?: Array<string>;
    };
    artifact_attestations?: {
      /**
       * @example ["example"]
       */
      trust_domain?: string;
      services?: Array<string>;
    };
  };
};
