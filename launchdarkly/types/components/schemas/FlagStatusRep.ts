export type FlagStatusRep = {
  /**
   * @example {"parent":{"href":"/api/v2/flags/my-project/my-flag","type":"application/json"},"self":{"href":"/api/v2/flag-statuses/my-project/my-flag","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
  /**
   * Status of the flag
   * @example "inactive"
   */
  name?: string;
  /**
   * Timestamp of last time flag was requested
   * @format date-time
   * @example "2020-02-05T18:17:01.514Z"
   */
  lastRequested?: string;
  /**
   * Default value seen from code
   */
  default?: unknown;
};
