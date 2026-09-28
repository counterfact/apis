export type FeatureFlagStatusAcrossEnvironments = {
  /**
   * Flag status for environment.
   * @example {"production":{"lastRequested":"2020-02-05T18:17:01.514Z","name":"inactive"}}
   */
  environments: { [key: string]: unknown };
  /**
   * feature flag key
   * @example "flag-key-123abc"
   */
  key: string;
  /**
   * @example {"parent":{"href":"/api/v2/flag-status","type":"application/json"},"self":{"href":"/api/v2/flag-status/my-project/my-flag","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
};
