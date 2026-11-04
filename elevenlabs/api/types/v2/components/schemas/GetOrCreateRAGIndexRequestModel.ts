import type { EmbeddingModelEnum } from "./EmbeddingModelEnum.js";
export type GetOrCreateRAGIndexRequestModel = {
  /**
   * ID of the knowledgebase document for which to retrieve the index
   */
  document_id: string;
  /**
   * Whether to create the RAG index if it does not exist
   */
  create_if_missing: boolean;
  /**
   * Embedding model to use for the RAG index
   */
  model: EmbeddingModelEnum;
};
