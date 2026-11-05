import type { ExternalSyncProvider } from "./ExternalSyncProvider.js";
/**
 * Tracks the link back to the original file in an external source.
 */
export type ExternalFileSyncInfo = {
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
   * Folder ID in the external system this file was synced from
   */
  source_parent_entity_id: string;
  /**
   * Original MIME type in the external system
   */
  source_mime_type: string;
  /**
   * Last modified time from the external system
   * @format date-time
   */
  source_modified_time: string;
  /**
   * KB folder ID of the sync root, used to query all entities under a sync tree
   */
  root_folder_id?: string | null;
};
