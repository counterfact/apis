import type { KnowledgeBaseContentSearchResult } from "./KnowledgeBaseContentSearchResult.js";
export type KnowledgeBaseContentSearchResponseModel = {
  results: Array<KnowledgeBaseContentSearchResult>;
  next_cursor?: string | null;
};
