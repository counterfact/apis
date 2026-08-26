import type { PullRequestRep } from "./PullRequestRep.js";

export type PullRequestCollectionRep = {
  /**
   * The total number of pull requests
   * @example 25
   */
  totalCount: number;
  /**
   * A list of pull requests
   */
  items: Array<PullRequestRep>;
  /**
   * The location and content type of related resources
   * @example {"next":{"href":"/api/v2/engineering-insights/pull-requests?after=a4290006-1fd1-4ca5-acf7-9f31fac61cf5","type":"application/json"},"self":{"href":"/api/v2/engineering-insights/pull-requests","type":"application/json"}}
   */
  _links?: { [key: string]: unknown };
};
