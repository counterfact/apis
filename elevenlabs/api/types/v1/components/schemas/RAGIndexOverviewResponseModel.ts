import type { RAGIndexOverviewEmbeddingModelResponseModel } from "./RAGIndexOverviewEmbeddingModelResponseModel.js";
export type RAGIndexOverviewResponseModel = {
  total_used_bytes: number;
  total_max_bytes: number;
  models: Array<RAGIndexOverviewEmbeddingModelResponseModel>;
};
