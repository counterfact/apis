/**
 * GitHub Actions cache retention policy for an enterprise.
 */
export type actions_cache_retention_limit_for_enterprise = {
  /**
   * For repositories & organizations in an enterprise, the maximum duration, in days, for which caches in a repository may be retained.
   * @example 14
   */
  max_cache_retention_days?: number;
};
