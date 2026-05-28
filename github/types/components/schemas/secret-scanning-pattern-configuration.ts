import type { secret_scanning_row_version } from "./secret-scanning-row-version.js";
import type { secret_scanning_pattern_override } from "./secret-scanning-pattern-override.js";

/**
 * A collection of secret scanning patterns and their settings related to push protection.
 */
export type secret_scanning_pattern_configuration = {
  pattern_config_version?: secret_scanning_row_version;
  /**
   * Overrides for partner patterns.
   */
  provider_pattern_overrides?: Array<secret_scanning_pattern_override>;
  /**
   * Overrides for custom patterns defined by the organization.
   */
  custom_pattern_overrides?: Array<secret_scanning_pattern_override>;
};
