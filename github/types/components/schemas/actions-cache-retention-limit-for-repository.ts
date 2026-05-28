/**
 * GitHub Actions cache retention policy for a repository.
 */
export type actions_cache_retention_limit_for_repository = {
  /**
   * The maximum number of days to keep caches in this repository.
   * @example 14
   */
  max_cache_retention_days?: number;
};
