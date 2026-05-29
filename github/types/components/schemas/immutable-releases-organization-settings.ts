/**
 * Check immutable releases settings for an organization.
 */
export type immutable_releases_organization_settings = {
  /**
   * The policy that controls how immutable releases are enforced in the organization.
   * @example "all"
   */
  enforced_repositories: "all" | "none" | "selected";
  /**
   * The API URL to use to get or set the selected repositories for immutable releases enforcement, when `enforced_repositories` is set to `selected`.
   */
  selected_repositories_url?: string;
};
