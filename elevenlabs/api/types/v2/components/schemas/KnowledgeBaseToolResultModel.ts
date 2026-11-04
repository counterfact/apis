import type { KnowledgeBaseToolStatus } from "./KnowledgeBaseToolStatus.js";
export type KnowledgeBaseToolResultModel = {
  /**
   * @default "knowledge_base_success"
   */
  result_type?: "knowledge_base_success";
  /**
   * @default "success"
   */
  status?: KnowledgeBaseToolStatus;
  /**
   * @default 0
   */
  chunk_count?: number;
  /**
   * @default "Referenced knowledge base."
   */
  message?: string;
};
