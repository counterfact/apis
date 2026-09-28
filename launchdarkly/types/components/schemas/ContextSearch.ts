export type ContextSearch = {
  /**
   * A collection of context filters
   * @example "*.name startsWith Jo,kind anyOf [\"user\",\"organization\"]"
   */
  filter?: string;
  /**
   * Specifies a field by which to sort. LaunchDarkly supports sorting by timestamp in ascending order by specifying <code>ts</code> for this value, or descending order by specifying <code>-ts</code>.
   * @example "-ts"
   */
  sort?: string;
  /**
   * Specifies the maximum number of items in the collection to return (max: 50, default: 20)
   * @example 10
   */
  limit?: number;
  /**
   * Limits results to contexts with sort values after the value specified. You can use this for pagination, however, we recommend using the <code>next</code> link instead, because this value is an obfuscated string.
   * @example "QAGFKH1313KUGI2351"
   */
  continuationToken?: string;
};
