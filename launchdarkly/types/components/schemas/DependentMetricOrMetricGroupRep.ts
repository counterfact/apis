import type { MetricInGroupRep } from "./MetricInGroupRep.js";

export type DependentMetricOrMetricGroupRep = {
  /**
   * A unique key to reference the metric or metric group
   * @example "metric-key-123abc"
   */
  key: string;
  /**
   * The version ID of the metric or metric group
   */
  _versionId: string;
  /**
   * A human-friendly name for the metric or metric group
   * @example "My metric"
   */
  name: string;
  /**
   * If this is a metric, then it represents the kind of event the metric tracks. If this is a metric group, then it represents the group type
   * @example "custom"
   */
  kind: "pageview" | "click" | "custom" | "funnel" | "standard";
  /**
   * For custom metrics, whether to track numeric changes in value against a baseline (<code>true</code>) or to track a conversion when an end user takes an action (<code>false</code>).
   * @example true
   */
  isNumeric?: boolean;
  /**
   * The location and content type of related resources
   * @example {"self":{"href":"/api/v2/metrics/my-project/my-metric","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
  /**
   * Whether this is a metric group or a metric
   */
  isGroup: boolean;
  /**
   * An ordered list of the metrics in this metric group
   */
  metrics?: Array<MetricInGroupRep>;
};
