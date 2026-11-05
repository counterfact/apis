import type { GetOrCreateRAGIndexRequestModel } from "./GetOrCreateRAGIndexRequestModel.js";
export type Body_Compute_RAG_indexes_in_batch_v1_convai_knowledge_base_rag_index_post =
  {
    /**
     * List of requested RAG indexes. Minimum 1, maximum 100 items.
     */
    items: Array<GetOrCreateRAGIndexRequestModel>;
  };
