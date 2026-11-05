import type { GetKnowledgeBaseSummaryURLResponseModel } from "./GetKnowledgeBaseSummaryURLResponseModel.js";
import type { GetKnowledgeBaseSummaryFileResponseModel } from "./GetKnowledgeBaseSummaryFileResponseModel.js";
import type { GetKnowledgeBaseSummaryTextResponseModel } from "./GetKnowledgeBaseSummaryTextResponseModel.js";
import type { GetKnowledgeBaseSummaryFolderResponseModel } from "./GetKnowledgeBaseSummaryFolderResponseModel.js";
export type KnowledgeBaseSummaryBatchSuccessfulResponseModel = {
  /**
   * @default "success"
   */
  status: "success";
  data:
    | (GetKnowledgeBaseSummaryURLResponseModel & { type: "url" })
    | (GetKnowledgeBaseSummaryFileResponseModel & { type: "file" })
    | (GetKnowledgeBaseSummaryTextResponseModel & { type: "text" })
    | (GetKnowledgeBaseSummaryFolderResponseModel & { type: "folder" });
};
