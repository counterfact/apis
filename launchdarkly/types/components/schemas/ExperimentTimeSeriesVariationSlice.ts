import type { ConfidenceIntervalRep } from "./ConfidenceIntervalRep.js";

export type ExperimentTimeSeriesVariationSlice = {
  value?: number;
  /**
   * @format int64
   */
  count?: number;
  cumulativeValue?: number;
  /**
   * @format int64
   */
  cumulativeCount?: number;
  conversionRate?: number;
  cumulativeConversionRate?: number;
  confidenceInterval?: ConfidenceIntervalRep;
  cumulativeConfidenceInterval?: ConfidenceIntervalRep;
};
