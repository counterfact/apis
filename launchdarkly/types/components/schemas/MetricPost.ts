import type { UrlPost } from "./UrlPost.js";
import type { MetricEventDefaultRep } from "./MetricEventDefaultRep.js";

export type MetricPost = {
  /**
   * A unique key to reference the metric
   * @example "metric-key-123abc"
   */
  key: string;
  /**
   * A human-friendly name for the metric
   * @example "Example metric"
   */
  name?: string;
  /**
   * Description of the metric
   * @example "optional description"
   */
  description?: string;
  /**
   * The kind of event your metric will track
   * @example "custom"
   */
  kind: "pageview" | "click" | "custom";
  /**
   * One or more CSS selectors. Required for click metrics only.
   * @example ".dropdown-toggle"
   */
  selector?: string;
  /**
   * One or more target URLs. Required for click and pageview metrics only.
   * @example "invalid example"
   */
  urls?: Array<UrlPost>;
  /**
   * Whether the metric is active. Set to <code>true</code> to record click or pageview metrics. Not applicable for custom metrics.
   * @example true
   */
  isActive?: boolean;
  /**
   * Whether to track numeric changes in value against a baseline (<code>true</code>) or to track a conversion when an end user takes an action (<code>false</code>). Required for custom metrics only.
   * @example false
   */
  isNumeric?: boolean;
  /**
   * The unit of measure. Applicable for numeric custom metrics only.
   * @example "orders"
   */
  unit?: string;
  /**
   * The event key to use in your code. Required for custom conversion/binary and custom numeric metrics only.
   * @example "sales generated"
   */
  eventKey?: string;
  /**
   * Success criteria. Required for custom numeric metrics, optional for custom conversion metrics.
   * @example "HigherThanBaseline"
   */
  successCriteria?: "HigherThanBaseline" | "LowerThanBaseline";
  /**
   * Tags for the metric
   * @example ["example-tag"]
   */
  tags?: Array<string>;
  /**
   * An array of randomization units allowed for this metric
   * @example ["user"]
   */
  randomizationUnits?: Array<string>;
  /**
   * The method by which multiple unit event values are aggregated
   * @example "average"
   */
  unitAggregationType?: "average" | "sum";
  /**
   * The method for analyzing metric events
   * @example "mean"
   */
  analysisType?: string;
  /**
   * The percentile for the analysis method. An integer denoting the target percentile between 0 and 100. Required when <code>analysisType</code> is <code>percentile</code>.
   * @example 95
   */
  percentileValue?: number;
  eventDefault?: MetricEventDefaultRep;
};
