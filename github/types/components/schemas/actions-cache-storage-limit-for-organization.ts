/**
 * GitHub Actions cache storage policy for an organization.
 */
export type actions_cache_storage_limit_for_organization = {
  /**
   * For repositories in the organization, the maximum size limit for the sum of all caches in a repository, in gigabytes.
   * @example 10
   */
  max_cache_size_gb?: number;
};
