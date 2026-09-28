import type { MetricListingRep } from "./MetricListingRep.js";

export type LegacyExperimentRep = {
  /**
   * @example "my-metric"
   */
  metricKey?: string;
  _metric?: MetricListingRep;
  /**
   * @example ["production","test","my-environment"]
   */
  environments?: Array<string>;
  _environmentSettings?: { [key: string]: unknown };
};
