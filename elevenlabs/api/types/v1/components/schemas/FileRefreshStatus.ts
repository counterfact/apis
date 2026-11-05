import type { CrawlStatus } from "./CrawlStatus.js";
/**
 * In-flight/last refresh state for an externally-synced KB file.
 */
export type FileRefreshStatus = {
  /**
   * @default "queued"
   */
  status?: CrawlStatus;
  enqueued_at?: number | null;
  started_at?: number | null;
  completed_at?: number | null;
  last_synced_at?: number | null;
  error_message?: string | null;
};
