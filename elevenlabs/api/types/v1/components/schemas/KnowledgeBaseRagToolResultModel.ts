import type { KnowledgeBaseRagToolStatus } from "./KnowledgeBaseRagToolStatus.js";
import type { KnowledgeBaseRagChunkModel } from "./KnowledgeBaseRagChunkModel.js";
export type KnowledgeBaseRagToolResultModel = {
  /**
   * @default "knowledge_base_rag_success"
   */
  result_type?: "knowledge_base_rag_success";
  /**
   * @default "success"
   */
  status?: KnowledgeBaseRagToolStatus;
  /**
   * Number of relevant chunks retrieved
   * @default 0
   */
  chunk_count?: number;
  /**
   * Human-readable status for the LLM about the search results
   * @default "Referenced knowledge base."
   */
  message?: string;
  /**
   * Retrieved chunks; populated only in the rag-result-in-tool-result mode
   */
  chunks?: Array<KnowledgeBaseRagChunkModel>;
};
