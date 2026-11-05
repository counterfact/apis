import type { CrawlType } from "./CrawlType.js";
import type { KnowledgeBaseFolderPathSegmentSummaryResponseModel } from "./KnowledgeBaseFolderPathSegmentSummaryResponseModel.js";
export type CreateCrawlJobResponseModel = {
  id: string;
  type: CrawlType;
  root_folder_id: string;
  status: string;
  created_at: number;
  /**
   * The folder path segments leading to the root folder, from root to parent folder.
   */
  folder_path?: Array<KnowledgeBaseFolderPathSegmentSummaryResponseModel>;
};
