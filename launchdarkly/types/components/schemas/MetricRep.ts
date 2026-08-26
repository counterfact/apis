import type { Link } from "./Link.js";
import type { Access } from "./Access.js";
import type { UnixMillis } from "./UnixMillis.js";
import type { Modification } from "./Modification.js";
import type { MemberSummary } from "./MemberSummary.js";
import type { MetricEventDefaultRep } from "./MetricEventDefaultRep.js";
import type { DependentExperimentListRep } from "./DependentExperimentListRep.js";
import type { DependentMetricGroupRep } from "./DependentMetricGroupRep.js";
import type { FlagListingRep } from "./FlagListingRep.js";
import type { UrlMatchers } from "./UrlMatchers.js";

export type MetricRep = {
  /**
   * The number of experiments using this metric
   * @example 0
   */
  experimentCount?: number;
  /**
   * The number of metric groups using this metric
   * @example 0
   */
  metricGroupCount?: number;
  /**
   * The ID of this metric
   * @example "5902deadbeef667524a01290"
   */
  _id: string;
  /**
   * The version ID of the metric
   * @example "version-id-123abc"
   */
  _versionId: string;
  /**
   * A unique key to reference the metric
   * @example "metric-key-123abc"
   */
  key: string;
  /**
   * A human-friendly name for the metric
   * @example "My metric"
   */
  name: string;
  /**
   * The kind of event the metric tracks
   * @example "custom"
   */
  kind: "pageview" | "click" | "custom";
  /**
   * The number of feature flags currently attached to this metric
   * @example 0
   */
  _attachedFlagCount?: number;
  /**
   * The location and content type of related resources
   * @example {"parent":{"href":"/api/v2/metrics/my-project","type":"application/json"},"self":{"href":"/api/v2/metrics/my-project/my-metric","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
  /**
   * Details on how to access the metric in the LaunchDarkly UI
   * @example "{\"href\":\"/experiments/metrics/my-metric/edit\",\"type\":\"text/html\"}"
   */
  _site?: Link;
  /**
   * Details on the allowed and denied actions for this metric
   */
  _access?: Access;
  /**
   * Tags for the metric
   * @example []
   */
  tags: Array<string>;
  /**
   * Timestamp of when the metric was created
   * @example "1628192791148"
   */
  _creationDate: UnixMillis;
  lastModified?: Modification;
  /**
   * The ID of the member who maintains this metric
   * @example "569fdeadbeef1644facecafe"
   */
  maintainerId?: string;
  /**
   * Details on the member who maintains this metric
   * @example "{\"_links\":{\"self\":{\"href\":\"/api/v2/members/569fdeadbeef1644facecafe\",\"type\":\"application/json\"}},\"_id\":\"569fdeadbeef1644facecafe\",\"firstName\":\"Ariel\",\"lastName\":\"Flores\",\"role\":\"owner\",\"email\":\"ariel@acme.com\"}"
   */
  _maintainer?: MemberSummary;
  /**
   * Description of the metric
   */
  description?: string;
  /**
   * For custom metrics, whether to track numeric changes in value against a baseline (<code>true</code>) or to track a conversion when an end user takes an action (<code>false</code>).
   * @example true
   */
  isNumeric?: boolean;
  /**
   * For custom metrics, the success criteria
   */
  successCriteria?: "HigherThanBaseline" | "LowerThanBaseline";
  /**
   * For numeric custom metrics, the unit of measure
   */
  unit?: string;
  /**
   * For custom metrics, the event key to use in your code
   */
  eventKey?: string;
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
  analysisType?: "mean" | "percentile";
  /**
   * The percentile for the analysis method. An integer denoting the target percentile between 0 and 100. Required when <code>analysisType</code> is <code>percentile</code>.
   * @example 95
   */
  percentileValue?: number;
  eventDefault?: MetricEventDefaultRep;
  /**
   * Experiments that use this metric, including those using a metric group that contains this metric
   */
  experiments?: DependentExperimentListRep;
  /**
   * Metric groups that use this metric
   */
  metricGroups?: Array<DependentMetricGroupRep>;
  /**
   * Whether the metric is active
   * @example true
   */
  isActive?: boolean;
  /**
   * Details on the flags attached to this metric
   */
  _attachedFeatures?: Array<FlagListingRep>;
  /**
   * Version of the metric
   * @example 1
   */
  _version?: number;
  /**
   * For click metrics, the CSS selectors
   */
  selector?: string;
  /**
   * For click and pageview metrics, the target URLs
   */
  urls?: UrlMatchers;
};
