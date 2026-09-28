import type { ClientSideAvailability } from "./ClientSideAvailability.js";
import type { BooleanDefaults } from "./BooleanDefaults.js";

export type flagDefaultsRep = {
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
  /**
   * A unique key for the flag default
   */
  key?: string;
  /**
   * A list of default tags for each flag
   * @example ["tag-1","tag-2"]
   */
  tags?: Array<string>;
  /**
   * Whether the flag should be temporary by default
   * @example true
   */
  temporary?: boolean;
  /**
   * Which client-side SDK types can use this flag by default. Set <code>usingMobileKey</code> to make the flag available for mobile SDKs. Set <code>usingEnvironmentId</code> to make the flag available for client-side SDKs.
   * @example "{\"usingMobileKey\": true, \"usingEnvironmentId\": false}"
   */
  defaultClientSideAvailability?: ClientSideAvailability;
  /**
   * Defaults for boolean flags within this project
   */
  booleanDefaults?: BooleanDefaults;
};
