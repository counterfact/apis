import type { MetricsInput } from "./MetricsInput.js";
import type { TreatmentsInput } from "./TreatmentsInput.js";
import type { FlagsInput } from "./FlagsInput.js";

export type IterationInput = {
  /**
   * The expected outcome of this experiment
   * @example "Example hypothesis, the new button placement will increase conversion"
   */
  hypothesis: string;
  /**
   * Whether to allow the experiment to reassign traffic to different variations when you increase or decrease the traffic in your experiment audience (true) or keep all traffic assigned to its initial variation (false). Defaults to true.
   * @example true
   */
  canReshuffleTraffic?: boolean;
  /**
   * Details on the metrics for this experiment
   */
  metrics: MetricsInput;
  /**
   * The key of the primary metric for this experiment. Either <code>primarySingleMetricKey</code> or <code>primaryFunnelKey</code> must be present.
   * @example "metric-key-123abc"
   */
  primarySingleMetricKey?: string;
  /**
   * The key of the primary funnel group for this experiment. Either <code>primarySingleMetricKey</code> or <code>primaryFunnelKey</code> must be present.
   * @example "metric-group-key-123abc"
   */
  primaryFunnelKey?: string;
  /**
   * Details on the variations you are testing in the experiment. You establish these variations in feature flags, and then reuse them in experiments.
   */
  treatments: TreatmentsInput;
  /**
   * Details on the feature flag and targeting rules for this iteration
   */
  flags: FlagsInput;
  /**
   * The unit of randomization for this iteration. Defaults to user.
   * @example "user"
   */
  randomizationUnit?: string;
};
