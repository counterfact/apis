import type { Access } from "./Access.js";
import type { UnixMillis } from "./UnixMillis.js";
import type { MaintainerRep } from "./MaintainerRep.js";
import type { MetricInGroupRep } from "./MetricInGroupRep.js";
import type { DependentExperimentListRep } from "./DependentExperimentListRep.js";

export type MetricGroupRep = {
  /**
   * The ID of this metric group
   * @example "bc3e5be1-02d2-40c7-9926-26d0aacd7aab"
   */
  _id: string;
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
  kind: "funnel" | "standard";
  /**
   * Description of the metric group
   * @example "Description of the metric group"
   */
  description?: string;
  /**
   * The location and content type of related resources
   * @example {"parent":{"href":"/api/v2/projects/my-project","type":"application/json"},"self":{"href":"/api/v2/projects/my-project/metric-groups/my-metric-group","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
  /**
   * Details on the allowed and denied actions for this metric group
   */
  _access?: Access;
  /**
   * Tags for the metric group
   * @example ["ops"]
   */
  tags: Array<string>;
  /**
   * Timestamp of when the metric group was created
   * @example "1628192791148"
   */
  _creationDate: UnixMillis;
  /**
   * Timestamp of when the metric group was last modified
   * @example "1628192791148"
   */
  _lastModified: UnixMillis;
  /**
   * The maintainer of this metric
   */
  maintainer: MaintainerRep;
  /**
   * An ordered list of the metrics in this metric group
   */
  metrics: Array<MetricInGroupRep>;
  /**
   * The version of this metric group
   * @example 1
   */
  _version: number;
  /**
   * Experiments that use this metric group. Only included if specified in the <code>expand</code> query parameter in a <code>getMetricGroup</code> request.
   */
  experiments?: DependentExperimentListRep;
  /**
   * The number of experiments using this metric group
   * @example 0
   */
  experimentCount?: number;
};
