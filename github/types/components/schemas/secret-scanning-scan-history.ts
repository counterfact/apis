import type { secret_scanning_scan } from "./secret-scanning-scan.js";

export type secret_scanning_scan_history = {
  incremental_scans?: Array<secret_scanning_scan>;
  pattern_update_scans?: Array<secret_scanning_scan>;
  backfill_scans?: Array<secret_scanning_scan>;
  custom_pattern_backfill_scans?: Array<
    secret_scanning_scan & {
      /**
       * Name of the custom pattern for custom pattern scans
       */
      pattern_name?: string;
      /**
       * Level at which the custom pattern is defined, one of "repository", "organization", or "enterprise"
       */
      pattern_scope?: string;
    }
  >;
  generic_secrets_backfill_scans?: Array<secret_scanning_scan>;
};
