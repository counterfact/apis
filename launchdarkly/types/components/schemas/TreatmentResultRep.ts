import type { CredibleIntervalRep } from "./CredibleIntervalRep.js";
import type { RelativeDifferenceRep } from "./RelativeDifferenceRep.js";
import type { Distribution } from "./Distribution.js";

export type TreatmentResultRep = {
  /**
   * The ID of the treatment
   * @example "92b8354e-360e-4d67-8f13-fa6a46ca8077"
   */
  treatmentId?: string;
  /**
   * The name of the treatment
   * @example "variation 25% off"
   */
  treatmentName?: string;
  /**
   * The average value of the variation in this sample. It doesn’t capture the uncertainty in the measurement, so it should not be the only measurement you use to make decisions.
   * @example 0.5432525951557093
   */
  mean?: number;
  /**
   * The range of the metric's values that you should have 90% confidence in.
   * @example "{\"lower\": 0.4060771673663068, \"upper\": 0.6713222134386467}"
   */
  credibleInterval?: CredibleIntervalRep;
  /**
   * The likelihood that this variation has the biggest effect on the primary metric. The variation with the highest probability is likely the best of the variations you're testing
   * @example 0.6083
   */
  pBest?: number;
  /**
   * Estimates of the relative difference between this treatment's mean and the mean of each other treatment
   * @example [{"fromTreatmentId":"92b8354e-360e-4d67-8f13-fa6a46ca8077","lower":-0.13708601934659803,"upper":0.42655970355712425}]
   */
  relativeDifferences?: Array<RelativeDifferenceRep>;
  /**
   * The number of units exposed to this treatment that have event values, including those that are configured to default to 0
   * @format int64
   * @example 76
   */
  units?: number;
  /**
   * The number of units exposed to this treatment.
   * @format int64
   * @example 332
   */
  traffic?: number;
  /**
   * The posterior distribution of the mean of the metric in this variation.
   */
  distribution?: Distribution;
};
