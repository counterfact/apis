/**
 * GitHub Actions cache storage policy for a repository.
 */
export type actions_cache_storage_limit_for_repository = {
  /**
   * The maximum total cache size for this repository, in gigabytes.
   * @example 10
   */
  max_cache_size_gb?: number;
};
