import type { GetKnowledgeBaseSummaryURLResponseModel } from "./GetKnowledgeBaseSummaryURLResponseModel.js";
import type { GetKnowledgeBaseSummaryFileResponseModel } from "./GetKnowledgeBaseSummaryFileResponseModel.js";
import type { GetKnowledgeBaseSummaryTextResponseModel } from "./GetKnowledgeBaseSummaryTextResponseModel.js";
import type { GetKnowledgeBaseSummaryFolderResponseModel } from "./GetKnowledgeBaseSummaryFolderResponseModel.js";
export type GetKnowledgeBaseListResponseModel = {
  documents: Array<
    | (GetKnowledgeBaseSummaryURLResponseModel & { type: "url" })
    | (GetKnowledgeBaseSummaryFileResponseModel & { type: "file" })
    | (GetKnowledgeBaseSummaryTextResponseModel & { type: "text" })
    | (GetKnowledgeBaseSummaryFolderResponseModel & { type: "folder" })
  >;
  next_cursor?: string | null;
  has_more: boolean;
};
