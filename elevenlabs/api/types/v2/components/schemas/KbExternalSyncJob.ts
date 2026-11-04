import type { ExternalSyncProvider } from "./ExternalSyncProvider.js";
import type { ExternalSyncJobTrigger } from "./ExternalSyncJobTrigger.js";
import type { CrawlStatus } from "./CrawlStatus.js";
import type { ExternalSyncJobType } from "./ExternalSyncJobType.js";
export type KbExternalSyncJob = {
  type: ExternalSyncProvider;
  folder_id: string;
  integration_connection_id: string;
  triggered_by: ExternalSyncJobTrigger;
  /**
   * @default "queued"
   */
  status?: CrawlStatus;
  sync_type?: ExternalSyncJobType | null;
  /**
   * @default 0
   */
  items_identified?: number;
  /**
   * @default 0
   */
  items_processed?: number;
  error_message?: string | null;
  started_at?: number | null;
  completed_at?: number | null;
  updated_at: number;
  id: string;
  created_at: number;
};
