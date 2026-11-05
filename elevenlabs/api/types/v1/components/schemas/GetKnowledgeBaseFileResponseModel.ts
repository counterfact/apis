import type { KnowledgeBaseDocumentMetadataResponseModel } from "./KnowledgeBaseDocumentMetadataResponseModel.js";
import type { DocumentUsageModeEnum } from "./DocumentUsageModeEnum.js";
import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
import type { KnowledgeBaseFolderPathSegmentResponseModel } from "./KnowledgeBaseFolderPathSegmentResponseModel.js";
import type { ContentFormat } from "./ContentFormat.js";
import type { ExternalFileSyncInfo } from "./ExternalFileSyncInfo.js";
import type { AutoSyncInfo } from "./AutoSyncInfo.js";
import type { FileRefreshStatus } from "./FileRefreshStatus.js";
export type GetKnowledgeBaseFileResponseModel = {
  id: string;
  name: string;
  metadata: KnowledgeBaseDocumentMetadataResponseModel;
  supported_usages: Array<DocumentUsageModeEnum>;
  access_info: ResourceAccessInfo;
  /**
   * The ID of the parent folder, or null if the document is at the root level.
   */
  folder_parent_id?: string | null;
  /**
   * The folder path segments leading to this entity, from root to parent folder.
   */
  folder_path?: Array<KnowledgeBaseFolderPathSegmentResponseModel>;
  type: "file";
  extracted_inner_html: string;
  /**
   * @default "html"
   */
  content_format?: ContentFormat;
  filename: string;
  external_sync_info?: ExternalFileSyncInfo | null;
  auto_sync_info?: AutoSyncInfo | null;
  /**
   * In-flight or last refresh state for an externally-synced file. Used by clients to render sync progress and disable re-sync while a refresh is queued or processing.
   */
  refresh_status?: FileRefreshStatus | null;
  /**
   * @default false
   */
  is_frozen?: boolean;
};
