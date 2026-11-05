import type { KnowledgeBaseDocumentMetadataResponseModel } from "./KnowledgeBaseDocumentMetadataResponseModel.js";
import type { DocumentUsageModeEnum } from "./DocumentUsageModeEnum.js";
import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
import type { KnowledgeBaseFolderPathSegmentResponseModel } from "./KnowledgeBaseFolderPathSegmentResponseModel.js";
import type { AutoSyncInfo } from "./AutoSyncInfo.js";
import type { ExternalFolderSyncInfo } from "./ExternalFolderSyncInfo.js";
import type { KbExternalSyncJob } from "./KbExternalSyncJob.js";
export type GetKnowledgeBaseFolderResponseModel = {
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
  type: "folder";
  children_count: number;
  /**
   * Number of non-folder documents anywhere in this folder's subtree (recursive). Counting stops past 1000;
   */
  document_count: number;
  auto_sync_info?: AutoSyncInfo | null;
  external_sync_info?: ExternalFolderSyncInfo | null;
  /**
   * @default false
   */
  is_frozen?: boolean;
  /**
   * Most recent (in-flight or terminal) external sync job for this folder, if any. Used by clients to render sync progress.
   */
  active_sync_job?: KbExternalSyncJob | null;
};
