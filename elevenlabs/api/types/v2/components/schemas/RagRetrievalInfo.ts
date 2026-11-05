import type { RagChunkMetadata } from "./RagChunkMetadata.js";
import type { EmbeddingModelEnum } from "./EmbeddingModelEnum.js";
export type RagRetrievalInfo = {
  chunks: Array<RagChunkMetadata>;
  embedding_model: EmbeddingModelEnum;
  retrieval_query: string;
  rag_latency_secs: number;
  used_chunk_ids?: Array<string>;
};
