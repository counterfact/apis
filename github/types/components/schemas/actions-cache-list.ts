/**
 * Repository actions caches
 */
export type actions_cache_list = {
  /**
   * Total number of caches
   * @example 2
   */
  total_count: number;
  /**
   * Array of caches
   */
  actions_caches: Array<{
    /**
     * @example 2
     */
    id?: number;
    /**
     * @example "refs/heads/main"
     */
    ref?: string;
    /**
     * @example "Linux-node-958aff96db2d75d67787d1e634ae70b659de937b"
     */
    key?: string;
    /**
     * @example "73885106f58cc52a7df9ec4d4a5622a5614813162cb516c759a30af6bf56e6f0"
     */
    version?: string;
    /**
     * @format date-time
     * @example "2019-01-24T22:45:36.000Z"
     */
    last_accessed_at?: string;
    /**
     * @format date-time
     * @example "2019-01-24T22:45:36.000Z"
     */
    created_at?: string;
    /**
     * @example 1024
     */
    size_in_bytes?: number;
  }>;
};
