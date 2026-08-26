import type { MetricInGroupResultsRep } from "./MetricInGroupResultsRep.js";

export type MetricGroupResultsRep = {
  /**
   * The location and content type of related resources
   */
  _links: { [key: string]: unknown };
  /**
   * An ordered list of the metrics in this metric group, and each of their results
   */
  metrics: Array<MetricInGroupResultsRep>;
};
