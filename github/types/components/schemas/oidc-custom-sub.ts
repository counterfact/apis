/**
 * Actions OIDC Subject customization
 */
export type oidc_custom_sub = {
  /**
   * Array of unique strings. Each claim key can only contain alphanumeric characters and underscores.
   */
  include_claim_keys: Array<string>;
  /**
   * Whether to opt in to the immutable OIDC subject claim format for the organization. When `true`, new OIDC tokens will use a stable, repository-ID-based `sub` claim instead of the name-based format.
   */
  use_immutable_subject?: boolean;
};
