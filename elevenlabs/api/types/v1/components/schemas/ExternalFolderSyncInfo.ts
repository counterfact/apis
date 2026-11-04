import type { ExternalSyncProvider } from "./ExternalSyncProvider.js";
/**
 * Metadata for a KB folder that mirrors an external source folder.
 */
export type ExternalFolderSyncInfo = {
  /**
   * Provider identifier
   */
  type: ExternalSyncProvider;
  /**
   * Entity ID in the external system
   */
  source_entity_id: string;
  /**
   * Integration connection instance ID
   */
  integration_connection_id: string;
  /**
   * KB folder ID of the sync root. None means this folder is the root.
   */
  root_folder_id?: string | null;
  /**
   * Opaque cursor for incremental sync, interpreted by the provider
   */
  sync_cursor?: string | null;
  /**
   * Unix timestamp of last completed sync
   */
  last_sync_at?: number | null;
};
