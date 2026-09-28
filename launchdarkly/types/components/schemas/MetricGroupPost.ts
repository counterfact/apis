import type { MetricInMetricGroupInput } from "./MetricInMetricGroupInput.js";

export type MetricGroupPost = {
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
   * Description of the metric group
   * @example "Description of the metric group"
   */
  description?: string;
  /**
   * The ID of the member who maintains this metric group
   * @example "569fdeadbeef1644facecafe"
   */
  maintainerId: string;
  /**
   * Tags for the metric group
   * @example ["ops"]
   */
  tags: Array<string>;
  /**
   * An ordered list of the metrics in this metric group
   */
  metrics: Array<MetricInMetricGroupInput>;
};
