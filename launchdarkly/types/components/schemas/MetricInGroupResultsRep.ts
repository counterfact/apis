import type { MetricInGroupRep } from "./MetricInGroupRep.js";
import type { ExperimentBayesianResultsRep } from "./ExperimentBayesianResultsRep.js";

export type MetricInGroupResultsRep = {
  /**
   * Metric metadata
   */
  metric: MetricInGroupRep;
  /**
   * The results of this metric
   */
  results: ExperimentBayesianResultsRep;
};
