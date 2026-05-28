/**
 * GitHub Actions cache storage policy for an enterprise.
 */
export type actions_cache_storage_limit_for_enterprise = {
  /**
   * For repositories & organizations in an enterprise, the maximum size limit for the sum of all caches in a repository, in gigabytes.
   * @example 10
   */
  max_cache_size_gb?: number;
};
