import type { KnowledgeBaseDocumentMetadataResponseModel } from "./KnowledgeBaseDocumentMetadataResponseModel.js";
import type { DocumentUsageModeEnum } from "./DocumentUsageModeEnum.js";
import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
import type { KnowledgeBaseFolderPathSegmentSummaryResponseModel } from "./KnowledgeBaseFolderPathSegmentSummaryResponseModel.js";
import type { DependentAvailableAgentIdentifier } from "./DependentAvailableAgentIdentifier.js";
import type { DependentUnknownAgentIdentifier } from "./DependentUnknownAgentIdentifier.js";
import type { AutoSyncInfo } from "./AutoSyncInfo.js";
import type { ExternalFolderSyncInfo } from "./ExternalFolderSyncInfo.js";
export type GetKnowledgeBaseSummaryFolderResponseModel = {
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
};
