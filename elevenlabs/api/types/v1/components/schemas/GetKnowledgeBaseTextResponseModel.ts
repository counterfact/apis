import type { KnowledgeBaseDocumentMetadataResponseModel } from "./KnowledgeBaseDocumentMetadataResponseModel.js";
import type { DocumentUsageModeEnum } from "./DocumentUsageModeEnum.js";
import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
import type { KnowledgeBaseFolderPathSegmentResponseModel } from "./KnowledgeBaseFolderPathSegmentResponseModel.js";
import type { ContentFormat } from "./ContentFormat.js";
export type GetKnowledgeBaseTextResponseModel = {
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
  type: "text";
  extracted_inner_html: string;
  /**
   * @default "html"
   */
  content_format?: ContentFormat;
};
