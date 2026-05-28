/**
 * Describe a region within a file for the alert.
 */
export type code_scanning_alert_location = {
  path?: string;
  start_line?: number;
  end_line?: number;
  start_column?: number;
  end_column?: number;
};
