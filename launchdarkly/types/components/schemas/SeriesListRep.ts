import type { SeriesMetadataRep } from "./SeriesMetadataRep.js";
import type { SeriesTimeSliceRep } from "./SeriesTimeSliceRep.js";

export type SeriesListRep = {
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
  /**
   * Metadata about each series
   */
  metadata: Array<SeriesMetadataRep>;
  /**
   * An array of data points with timestamps. Each element of the array is an object with a 'time' field, whose value is the timestamp, and one or more key fields. If there are multiple key fields, they are labeled '0', '1', and so on, and are explained in the <code>metadata</code>.
   * @example [{"0":11,"1":15,"time":1677888000000}]
   */
  series: Array<SeriesTimeSliceRep>;
};
