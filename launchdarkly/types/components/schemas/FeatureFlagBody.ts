import type { ClientSideAvailabilityPost } from "./ClientSideAvailabilityPost.js";
import type { Variation } from "./Variation.js";
import type { CustomProperties } from "./CustomProperties.js";
import type { Defaults } from "./Defaults.js";
import type { MigrationSettingsPost } from "./MigrationSettingsPost.js";

export type FeatureFlagBody = {
  /**
   * A human-friendly name for the feature flag
   * @example "My flag"
   */
  name: string;
  /**
   * A unique key used to reference the flag in your code
   * @example "flag-key-123abc"
   */
  key: string;
  /**
   * Description of the feature flag. Defaults to an empty string.
   * @example "This flag controls the example widgets"
   */
  description?: string;
  /**
   * Deprecated, use <code>clientSideAvailability</code>. Whether this flag should be made available to the client-side JavaScript SDK. Defaults to <code>false</code>.
   * @deprecated
   */
  includeInSnippet?: boolean;
  /**
   * Which type of client-side SDKs the feature flag is available to
   * @example "{\"usingMobileKey\":true,\"usingEnvironmentId\":false}"
   */
  clientSideAvailability?: ClientSideAvailabilityPost;
  /**
   * An array of possible variations for the flag. The variation values must be unique. If omitted, two boolean variations of <code>true</code> and <code>false</code> will be used.
   * @example [{"value":true},{"value":false}]
   */
  variations?: Array<Variation>;
  /**
   * Whether the flag is a temporary flag. Defaults to <code>true</code>.
   * @example false
   */
  temporary?: boolean;
  /**
   * Tags for the feature flag. Defaults to an empty array.
   * @example ["example-tag"]
   */
  tags?: Array<string>;
  /**
   * Metadata attached to the feature flag, in the form of the property key associated with a name and array of values for the metadata to associate with this flag. Typically used to store data related to an integration.
   * @example "{ \"jira.issues\": {\"name\": \"Jira issues\", \"value\": [\"is-123\", \"is-456\"]} }"
   */
  customProperties?: CustomProperties;
  /**
   * The indices, from the array of variations, for the variations to serve by default when targeting is on and when targeting is off. These variations will be used for this flag in new environments. If omitted, the first and last variation will be used.
   * @example "{\"onVariation\":0, \"offVariation\":1}"
   */
  defaults?: Defaults;
  /**
   * Purpose of the flag
   * @example "migration"
   */
  purpose?: "migration";
  /**
   * Settings relevant to flags where <code>purpose</code> is <code>migration</code>
   */
  migrationSettings?: MigrationSettingsPost;
  /**
   * The ID of the member who maintains this feature flag
   * @example "12ab3c45de678910fgh12345"
   */
  maintainerId?: string;
  /**
   * The key of the team that maintains this feature flag
   * @example "team-1"
   */
  maintainerTeamKey?: string;
};
