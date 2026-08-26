import type { FlagCopyConfigEnvironment } from "./FlagCopyConfigEnvironment.js";

export type FlagCopyConfigPost = {
  /**
   * The source environment
   * @example "{\"key\": \"source-env-key-123abc\", \"currentVersion\": 1}"
   */
  source: FlagCopyConfigEnvironment;
  /**
   * The target environment
   * @example "{\"key\": \"target-env-key-123abc\", \"currentVersion\": 1}"
   */
  target: FlagCopyConfigEnvironment;
  /**
   * Optional comment
   */
  comment?: string;
  /**
   * Optional list of the flag changes to copy from the source environment to the target environment. You may include either <code>includedActions</code> or <code>excludedActions</code>, but not both. If you include neither, then all flag changes will be copied.
   * @example ["updateOn"]
   */
  includedActions?: Array<
    | "updateOn"
    | "updateRules"
    | "updateFallthrough"
    | "updateOffVariation"
    | "updatePrerequisites"
    | "updateTargets"
    | "updateFlagConfigMigrationSettings"
  >;
  /**
   * Optional list of the flag changes NOT to copy from the source environment to the target environment. You may include either  <code>includedActions</code> or <code>excludedActions</code>, but not both. If you include neither, then all flag changes will be copied.
   * @example ["updateOn"]
   */
  excludedActions?: Array<
    | "updateOn"
    | "updateRules"
    | "updateFallthrough"
    | "updateOffVariation"
    | "updatePrerequisites"
    | "updateTargets"
    | "updateFlagConfigMigrationSettings"
  >;
};
