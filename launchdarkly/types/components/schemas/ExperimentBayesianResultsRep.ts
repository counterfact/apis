import type { TreatmentResultRep } from "./TreatmentResultRep.js";
import type { MetricSeen } from "./MetricSeen.js";
import type { SlicedResultsRep } from "./SlicedResultsRep.js";

export type ExperimentBayesianResultsRep = {
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
  /**
   * Deprecated, use <code>results</code> instead. Only populated when response does not contain results sliced by multiple attributes.
   * @deprecated
   */
  treatmentResults?: Array<TreatmentResultRep>;
  metricSeen?: MetricSeen;
  /**
   * The probability of a Sample Ratio Mismatch
   * @example 0.9999999999999738
   */
  probabilityOfMismatch?: number;
  /**
   * A list of attribute values and their corresponding treatment results
   */
  results?: Array<SlicedResultsRep>;
};
