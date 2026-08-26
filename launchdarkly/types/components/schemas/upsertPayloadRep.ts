import type { BooleanFlagDefaults } from "./BooleanFlagDefaults.js";
import type { DefaultClientSideAvailability } from "./DefaultClientSideAvailability.js";

export type upsertPayloadRep = {
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
  /**
   * A list of default tags for each flag
   * @example ["tag-1","tag-2"]
   */
  tags: Array<string>;
  /**
   * Whether the flag should be temporary by default
   * @example true
   */
  temporary: boolean;
  booleanDefaults: BooleanFlagDefaults;
  /**
   * Which client-side SDK types can use this flag by default.
   */
  defaultClientSideAvailability: DefaultClientSideAvailability;
};
