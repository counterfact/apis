export type AutoSyncInfo = {
  /**
   * Minimum frequency (in days) at which the document is refreshed. The actual interval may be shorter, never longer.
   * @default 7
   */
  minimum_frequency_days?: number;
  /**
   * Whether to remove the document if the URL becomes unavailable
   * @default false
   */
  auto_remove?: boolean;
  /**
   * Number of consecutive sync failures
   * @default 0
   */
  consec_failures?: number;
  /**
   * Unix timestamp for the next scheduled sync or None (in case of folders)
   */
  next_refresh_by?: number | null;
};
