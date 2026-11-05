import type { GetKnowledgeBaseSummaryURLResponseModel } from "./GetKnowledgeBaseSummaryURLResponseModel.js";
import type { GetKnowledgeBaseSummaryFileResponseModel } from "./GetKnowledgeBaseSummaryFileResponseModel.js";
import type { GetKnowledgeBaseSummaryTextResponseModel } from "./GetKnowledgeBaseSummaryTextResponseModel.js";
import type { GetKnowledgeBaseSummaryFolderResponseModel } from "./GetKnowledgeBaseSummaryFolderResponseModel.js";
import type { SearchHighlightSegment } from "./SearchHighlightSegment.js";
export type KnowledgeBaseContentSearchResult = {
  document:
    | (GetKnowledgeBaseSummaryURLResponseModel & { type: "url" })
    | (GetKnowledgeBaseSummaryFileResponseModel & { type: "file" })
    | (GetKnowledgeBaseSummaryTextResponseModel & { type: "text" })
    | (GetKnowledgeBaseSummaryFolderResponseModel & { type: "folder" });
  search_snippet?: Array<SearchHighlightSegment> | null;
  score: number;
};
