export type MetricInGroupRep = {
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
  /**
   * Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a <code>funnel</code>.
   * @example "Step 1"
   */
  nameInGroup?: string;
  /**
   * The randomization units for the metric
   * @example ["user"]
   */
  randomizationUnits?: Array<string>;
};
