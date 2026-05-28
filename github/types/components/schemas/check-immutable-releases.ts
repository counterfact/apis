/**
 * Check immutable releases
 */
export type check_immutable_releases = {
  /**
   * Whether immutable releases are enabled for the repository.
   * @example true
   */
  enabled: boolean;
  /**
   * Whether immutable releases are enforced by the repository owner.
   * @example false
   */
  enforced_by_owner: boolean;
};
