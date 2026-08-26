import type { ConfidenceIntervalRep } from "./ConfidenceIntervalRep.js";

export type ExperimentTotalsRep = {
  cumulativeValue?: number;
  /**
   * @format int64
   */
  cumulativeCount?: number;
  /**
   * @format int64
   */
  cumulativeImpressionCount?: number;
  cumulativeConversionRate?: number;
  cumulativeConfidenceInterval?: ConfidenceIntervalRep;
  pValue?: number;
  improvement?: number;
  /**
   * @format int64
   */
  minSampleSize?: number;
};
