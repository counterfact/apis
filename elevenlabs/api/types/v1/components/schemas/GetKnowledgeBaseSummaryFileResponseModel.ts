import type { KnowledgeBaseDocumentMetadataResponseModel } from "./KnowledgeBaseDocumentMetadataResponseModel.js";
import type { DocumentUsageModeEnum } from "./DocumentUsageModeEnum.js";
import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
import type { KnowledgeBaseFolderPathSegmentSummaryResponseModel } from "./KnowledgeBaseFolderPathSegmentSummaryResponseModel.js";
import type { DependentAvailableAgentIdentifier } from "./DependentAvailableAgentIdentifier.js";
import type { DependentUnknownAgentIdentifier } from "./DependentUnknownAgentIdentifier.js";
import type { ExternalFileSyncInfo } from "./ExternalFileSyncInfo.js";
import type { AutoSyncInfo } from "./AutoSyncInfo.js";
import type { FileRefreshStatus } from "./FileRefreshStatus.js";
export type GetKnowledgeBaseSummaryFileResponseModel = {
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
  folder_path?: Array<KnowledgeBaseFolderPathSegmentSummaryResponseModel>;
  /**
   * This field is deprecated and will be removed in the future, use the separate endpoint to get dependent agents instead.
   * @deprecated
   */
  dependent_agents: Array<
    | (DependentAvailableAgentIdentifier & { type: "available" })
    | (DependentUnknownAgentIdentifier & { type: "unknown" })
  >;
  type: "file";
  external_sync_info?: ExternalFileSyncInfo | null;
  auto_sync_info?: AutoSyncInfo | null;
  refresh_status?: FileRefreshStatus | null;
  /**
   * @default false
   */
  is_frozen?: boolean;
};
