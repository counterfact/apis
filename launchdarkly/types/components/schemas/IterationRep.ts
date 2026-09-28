import type { UnixMillis } from "./UnixMillis.js";
import type { DependentMetricOrMetricGroupRep } from "./DependentMetricOrMetricGroupRep.js";
import type { MetricV2Rep } from "./MetricV2Rep.js";
import type { DependentMetricGroupRepWithMetrics } from "./DependentMetricGroupRepWithMetrics.js";
import type { TreatmentRep } from "./TreatmentRep.js";

export type IterationRep = {
  /**
   * The iteration ID
   * @example "12ab3c45de678910fgh12345"
   */
  _id?: string;
  /**
   * The expected outcome of this experiment
   * @example "The new button placement will increase conversion"
   */
  hypothesis: string;
  /**
   * The status of the iteration: <code>not_started</code>, <code>running</code>, <code>stopped</code>
   * @example "running"
   */
  status: string;
  /**
   * Timestamp of when the iteration was created
   * @example "1654104600000"
   */
  createdAt: UnixMillis;
  /**
   * Timestamp of when the iteration started
   * @example "1655314200000"
   */
  startedAt?: UnixMillis;
  /**
   * Timestamp of when the iteration ended
   * @example "1656610200000"
   */
  endedAt?: UnixMillis;
  /**
   * The ID of the treatment chosen when the experiment stopped
   * @example "122c9f3e-da26-4321-ba68-e0fc02eced58"
   */
  winningTreatmentId?: string;
  /**
   * The reason you stopped the experiment
   * @example "We ran this iteration for two weeks and the winning variation was clear"
   */
  winningReason?: string;
  /**
   * Whether the experiment may reassign traffic to different variations when the experiment audience changes (true) or must keep all traffic assigned to its initial variation (false).
   * @example true
   */
  canReshuffleTraffic?: boolean;
  /**
   * Details on the flag used in this experiment
   */
  flags?: { [key: string]: unknown };
  /**
   * Deprecated, use <code>primarySingleMetric</code> and <code>primaryFunnel</code> instead. Details on the primary metric for this experiment.
   * @deprecated
   */
  primaryMetric?: DependentMetricOrMetricGroupRep;
  /**
   * Details on the primary metric for this experiment
   */
  primarySingleMetric?: MetricV2Rep;
  /**
   * Details on the primary funnel group for this experiment
   */
  primaryFunnel?: DependentMetricGroupRepWithMetrics;
  /**
   * The unit of randomization for this iteration
   * @example "user"
   */
  randomizationUnit?: string;
  /**
   * Details on the variations you are testing in the experiment
   */
  treatments?: Array<TreatmentRep>;
  /**
   * Deprecated, use <code>metrics</code> instead. Details on the secondary metrics for this experiment.
   * @deprecated
   */
  secondaryMetrics?: Array<MetricV2Rep>;
  /**
   * Details on the metrics for this experiment
   */
  metrics?: Array<DependentMetricOrMetricGroupRep>;
};
