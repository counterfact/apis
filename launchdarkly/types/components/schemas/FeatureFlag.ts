import type { UnixMillis } from "./UnixMillis.js";
import type { ClientSideAvailability } from "./ClientSideAvailability.js";
import type { Variation } from "./Variation.js";
import type { MemberSummary } from "./MemberSummary.js";
import type { MaintainerTeam } from "./MaintainerTeam.js";
import type { ExperimentInfoRep } from "./ExperimentInfoRep.js";
import type { CustomProperties } from "./CustomProperties.js";
import type { Defaults } from "./Defaults.js";
import type { FlagMigrationSettingsRep } from "./FlagMigrationSettingsRep.js";

export type FeatureFlag = {
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
   * Associated maintainerId for the feature flag
   * @example "569f183514f4432160000007"
   */
  maintainerId?: string;
  /**
   * Associated maintainer member info for the feature flag
   */
  _maintainer?: MemberSummary;
  /**
   * The key of the associated team that maintains this feature flag
   * @example "team-1"
   */
  maintainerTeamKey?: string;
  /**
   * Associated maintainer team info for the feature flag
   */
  _maintainerTeam?: MaintainerTeam;
  /**
   * Deprecated, use <code>experiments</code> instead
   * @example []
   * @deprecated
   */
  goalIds?: Array<string>;
  /**
   * Experimentation data for the feature flag
   * @example "{\"baselineIdx\": 0,\"items\": []}"
   */
  experiments: ExperimentInfoRep;
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
   * Boolean indicating if the feature flag is deprecated
   * @example false
   */
  deprecated: boolean;
  /**
   * If deprecated is true, date of deprecation
   * @example "1494437420312"
   */
  deprecatedDate?: UnixMillis;
  /**
   * The indices, from the array of variations, for the variations to serve by default when targeting is on and when targeting is off. These variations will be used for this flag in new environments. If omitted, the first and last variation will be used.
   * @example "{\"onVariation\":0,\"offVariation\":1}"
   */
  defaults?: Defaults;
  _purpose?: string;
  /**
   * Migration-related settings for the flag
   */
  migrationSettings?: FlagMigrationSettingsRep;
  /**
   * Details on the environments for this flag. Only returned if the request is filtered by environment, using the <code>filterEnv</code> query parameter.
   * @example {"my-environment":{"_environmentName":"My Environment","_site":{"href":"/default/my-environment/features/client-side-flag","type":"text/html"},"_summary":{"prerequisites":0,"variations":{"0":{"contextTargets":1,"isFallthrough":true,"nullRules":0,"rules":0,"targets":1},"1":{"isOff":true,"nullRules":0,"rules":0,"targets":0}}},"archived":false,"contextTargets":[{"contextKind":"device","values":["device-key-123abc"],"variation":0}],"fallthrough":{"variation":0},"lastModified":1627071171347,"offVariation":1,"on":false,"prerequisites":[],"rules":[],"salt":"61eddeadbeef4da1facecafe3a60a397","sel":"810edeadbeef4844facecafe438f2999492","targets":[{"contextKind":"user","values":["user-key-123abc"],"variation":0}],"trackEvents":false,"trackEventsFallthrough":false,"version":1}}
   */
  environments: { [key: string]: unknown };
};
