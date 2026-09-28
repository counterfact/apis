export type MetricV2Rep = {
  /**
   * The metric key
   * @example "metric-key-123abc"
   */
  key: string;
  /**
   * The version ID of the metric
   * @example "version-id-123abc"
   */
  _versionId?: string;
  /**
   * The metric name
   * @example "Example metric"
   */
  name: string;
  /**
   * The kind of event the metric tracks
   * @example "custom"
   */
  kind: "pageview" | "click" | "custom";
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
};
