export type DependentMetricGroupRep = {
  /**
   * A unique key to reference the metric group
   * @example "metric-group-key-123abc"
   */
  key: string;
  /**
   * A human-friendly name for the metric group
   * @example "My metric group"
   */
  name: string;
  /**
   * The type of the metric group
   * @example "funnel"
   */
  kind: "funnel";
  /**
   * The location and content type of related resources
   * @example {"parent":{"href":"/api/v2/projects/my-project","type":"application/json"},"self":{"href":"/api/v2/projects/my-project/metric-groups/my-metric-group","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
};
