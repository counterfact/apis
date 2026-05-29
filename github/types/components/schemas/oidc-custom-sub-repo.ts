/**
 * Actions OIDC subject customization for a repository
 */
export type oidc_custom_sub_repo = {
  /**
   * Whether to use the default template or not. If `true`, the `include_claim_keys` field is ignored.
   */
  use_default: boolean;
  /**
   * Array of unique strings. Each claim key can only contain alphanumeric characters and underscores.
   */
  include_claim_keys?: Array<string>;
  /**
   * Whether the repository has opted in to the immutable OIDC subject claim format. When `true`, OIDC tokens will use a stable, repository-ID-based `sub` claim. If not set at the repository level, falls back to the organization-level setting.
   */
  use_immutable_subject?: boolean;
  /**
   * The current `sub` claim prefix for this repository.
   */
  sub_claim_prefix?: string;
};
