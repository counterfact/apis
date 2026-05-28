/**
 * GitHub Actions Cache Usage by repository.
 */
export type actions_cache_usage_by_repository = {
  /**
   * The repository owner and name for the cache usage being shown.
   * @example "octo-org/Hello-World"
   */
  full_name: string;
  /**
   * The sum of the size in bytes of all the active cache items in the repository.
   * @example 2322142
   */
  active_caches_size_in_bytes: number;
  /**
   * The number of active caches in the repository.
   * @example 3
   */
  active_caches_count: number;
};
