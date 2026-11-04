export type ListTestsByIdsRequestModel = {
  /**
   * List of test IDs to fetch. No duplicates allowed. Prefer at most 1000 IDs per request.
   */
  test_ids: Array<string>;
};
