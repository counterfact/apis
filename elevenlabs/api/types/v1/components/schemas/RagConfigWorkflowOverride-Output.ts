import type { EmbeddingModelEnum } from "./EmbeddingModelEnum.js";
import type { KnowledgeBaseToolInfo } from "./KnowledgeBaseToolInfo.js";
export type RagConfigWorkflowOverride_Output = {
  enabled?: boolean | null;
  embedding_model?: EmbeddingModelEnum | null;
  /**
   * Maximum vector distance of retrieved chunks.
   */
  max_vector_distance?: number | null;
  /**
   * Maximum total length of document chunks retrieved from RAG.
   */
  max_documents_length?: number | null;
  /**
   * Maximum number of RAG document chunks to initially retrieve from the vector store. These are then further filtered by vector distance and total length.
   */
  max_retrieved_rag_chunks_count?: number | null;
  /**
   * Number of candidates evaluated in ANN vector search. Higher number means better results, but higher latency. Minimum recommended value is 100. If disabled, the default value is used.
   */
  num_candidates?: number | null;
  /**
   * Custom prompt for rewriting user queries before RAG retrieval. The conversation history will be automatically appended at the end. If not set, the default prompt will be used.
   */
  query_rewrite_prompt_override?: string | null;
  /**
   * When set, the agent uses the knowledge_base tool instead of the legacy knowledge_base_rag tool. None means the agent is not opted in.
   */
  knowledge_base_tool_info?: KnowledgeBaseToolInfo | null;
};
