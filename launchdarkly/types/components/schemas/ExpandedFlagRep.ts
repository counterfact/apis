import type { UnixMillis } from "./UnixMillis.js";
import type { ClientSideAvailability } from "./ClientSideAvailability.js";
import type { Variation } from "./Variation.js";
import type { MemberSummary } from "./MemberSummary.js";
import type { CustomProperties } from "./CustomProperties.js";
import type { Defaults } from "./Defaults.js";

export type ExpandedFlagRep = {
  /**
   * A human-friendly name for the feature flag
   * @example "My Flag"
   */
  name: string;
  /**
   * Kind of feature flag
   * @example "boolean"
   */
  kind: "boolean" | "multivariate";
  /**
   * Description of the feature flag
   * @example "This flag controls the example widgets"
   */
  description?: string;
  /**
   * A unique key used to reference the flag in your code
   * @example "flag-key-123abc"
   */
  key: string;
  /**
   * Version of the feature flag
   * @example 1
   */
  _version: number;
  /**
   * Timestamp of flag creation date
   * @example "1494437420312"
   */
  creationDate: UnixMillis;
  /**
   * Deprecated, use <code>clientSideAvailability</code>. Whether this flag should be made available to the client-side JavaScript SDK
   * @example true
   * @deprecated
   */
  includeInSnippet?: boolean;
  /**
   * Which type of client-side SDKs the feature flag is available to
   * @example "{\"usingMobileKey\":true,\"usingEnvironmentId\":false}"
   */
  clientSideAvailability?: ClientSideAvailability;
  /**
   * An array of possible variations for the flag
   * @example [{"_id":"e432f62b-55f6-49dd-a02f-eb24acf39d05","value":true},{"_id":"a00bf58d-d252-476c-b915-15a74becacb4","value":false}]
   */
  variations: Array<Variation>;
  /**
   * Whether the flag is a temporary flag
   * @example true
   */
  temporary: boolean;
  /**
   * Tags for the feature flag
   * @example ["example-tag"]
   */
  tags: Array<string>;
  /**
   * The location and content type of related resources
   * @example {"parent":{"href":"/api/v2/flags/my-project","type":"application/json"},"self":{"href":"/api/v2/flags/my-project/my-flag","type":"application/json"}}
   */
  _links: { [key: string]: unknown };
  /**
   * The ID of the member who maintains the flag
   * @example "569f183514f4432160000007"
   */
  maintainerId?: string;
  /**
   * Details on the member who maintains this feature flag
   */
  _maintainer?: MemberSummary;
  /**
   * Metadata attached to the feature flag, in the form of the property key associated with a name and array of values for the metadata to associate with this flag. Typically used to store data related to an integration.
   * @example "{\"jira.issues\":{\"name\":\"Jira issues\",\"value\":[\"is-123\",\"is-456\"]}}"
   */
  customProperties: CustomProperties;
  /**
   * Boolean indicating if the feature flag is archived
   * @example false
   */
  archived: boolean;
  /**
   * If archived is true, date of archive
   * @example "1494437420312"
   */
  archivedDate?: UnixMillis;
  /**
   * The indices, from the array of variations, for the variations to serve by default when targeting is on and when targeting is off. These variations will be used for this flag in new environments. If omitted, the first and last variation will be used.
   * @example "{\"onVariation\":0,\"offVariation\":1}"
   */
  defaults?: Defaults;
};
