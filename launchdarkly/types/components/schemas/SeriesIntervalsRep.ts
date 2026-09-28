import type { Series } from "./Series.js";

export type SeriesIntervalsRep = {
  /**
   * An array of timestamps and values for a given meter
   */
  series: Array<Series>;
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
};
