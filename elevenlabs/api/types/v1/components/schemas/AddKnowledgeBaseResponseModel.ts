import type { KnowledgeBaseFolderPathSegmentSummaryResponseModel } from "./KnowledgeBaseFolderPathSegmentSummaryResponseModel.js";
export type AddKnowledgeBaseResponseModel = {
  id: string;
  name: string;
  /**
   * The folder path segments leading to this entity, from root to parent folder.
   */
  folder_path?: Array<KnowledgeBaseFolderPathSegmentSummaryResponseModel>;
};
