import type { FlagEventRep } from "./FlagEventRep.js";

export type FlagEventCollectionRep = {
  /**
   * The total number of flag events
   * @example 1200
   */
  totalCount: number;
  /**
   * A list of flag events
   */
  items: Array<FlagEventRep>;
  /**
   * The location and content type of related resources
   * @example {"next":{"href":"/api/v2/engineering-insights/flag-events?after=a4290006-1fd1-4ca5-acf7-9f31fac61cf5","type":"application/json"},"self":{"href":"/api/v2/engineering-insights/flag-events","type":"application/json"}}
   */
  _links?: { [key: string]: unknown };
};
