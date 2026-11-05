import type { EmbeddingModelEnum } from "./EmbeddingModelEnum.js";
import type { RAGIndexStatus } from "./RAGIndexStatus.js";
import type { RAGDocumentIndexUsage } from "./RAGDocumentIndexUsage.js";
export type RAGDocumentIndexResponseModel = {
  id: string;
  model: EmbeddingModelEnum;
  status: RAGIndexStatus;
  progress_percentage: number;
  document_model_index_usage: RAGDocumentIndexUsage;
};
